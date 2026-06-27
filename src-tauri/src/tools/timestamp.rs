use chrono::{DateTime, NaiveDateTime, Utc};

/// 自动识别:纯数字 → 当作 Unix 时间戳(秒/毫秒)转日期;否则当作日期字符串转时间戳。
#[tauri::command]
pub fn timestamp_convert(input: String) -> Result<String, String> {
    let trimmed = input.trim();
    if trimmed.is_empty() {
        return Ok(String::new());
    }

    // 1) 纯整数 → Unix 时间戳
    if let Ok(n) = trimmed.parse::<i64>() {
        // 13 位以上视作毫秒
        let (secs, nanos) = if trimmed.trim_start_matches('-').len() >= 13 {
            (n / 1000, ((n % 1000).unsigned_abs() as u32) * 1_000_000)
        } else {
            (n, 0)
        };
        let dt = DateTime::from_timestamp(secs, nanos)
            .ok_or_else(|| "时间戳超出可表示范围".to_string())?;
        return Ok(format!(
            "UTC   {}\n本地   {}\nISO    {}",
            dt.format("%Y-%m-%d %H:%M:%S"),
            dt.with_timezone(&chrono::Local).format("%Y-%m-%d %H:%M:%S %Z"),
            dt.to_rfc3339()
        ));
    }

    // 2) 日期字符串 → Unix 时间戳
    let parsed: DateTime<Utc> = trimmed
        .parse::<DateTime<Utc>>()
        .or_else(|_| {
            NaiveDateTime::parse_from_str(trimmed, "%Y-%m-%d %H:%M:%S")
                .map(|n| n.and_utc())
        })
        .or_else(|_| {
            NaiveDateTime::parse_from_str(trimmed, "%Y/%m/%d %H:%M:%S")
                .map(|n| n.and_utc())
        })
        .map_err(|_| "无法识别的时间戳或日期格式".to_string())?;

    Ok(format!(
        "秒     {}\n毫秒   {}",
        parsed.timestamp(),
        parsed.timestamp_millis()
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn seconds_to_date() {
        let out = timestamp_convert("0".into()).unwrap();
        assert!(out.contains("1970-01-01 00:00:00"));
    }

    #[test]
    fn millis_to_date() {
        let out = timestamp_convert("1700000000000".into()).unwrap();
        assert!(out.contains("2023-11-14"));
    }

    #[test]
    fn date_to_unix() {
        let out = timestamp_convert("1970-01-01 00:00:00".into()).unwrap();
        assert!(out.contains("秒     0"));
    }

    #[test]
    fn invalid() {
        assert!(timestamp_convert("not-a-date".into()).is_err());
    }
}
