fn parse_hex(s: &str) -> Option<(u8, u8, u8)> {
    let h = s.trim().trim_start_matches('#');
    let full = match h.len() {
        3 => h.chars().flat_map(|c| [c, c]).collect::<String>(),
        6 => h.to_string(),
        _ => return None,
    };
    let r = u8::from_str_radix(&full[0..2], 16).ok()?;
    let g = u8::from_str_radix(&full[2..4], 16).ok()?;
    let b = u8::from_str_radix(&full[4..6], 16).ok()?;
    Some((r, g, b))
}

fn parse_rgb(s: &str) -> Option<(u8, u8, u8)> {
    let inner = s.trim().trim_start_matches("rgb").trim_start_matches('(').trim_end_matches(')');
    let parts: Vec<&str> = inner.split(',').collect();
    if parts.len() != 3 {
        return None;
    }
    let r = parts[0].trim().parse::<u8>().ok()?;
    let g = parts[1].trim().parse::<u8>().ok()?;
    let b = parts[2].trim().parse::<u8>().ok()?;
    Some((r, g, b))
}

fn to_hsl(r: u8, g: u8, b: u8) -> (u32, u32, u32) {
    let (rf, gf, bf) = (r as f64 / 255.0, g as f64 / 255.0, b as f64 / 255.0);
    let max = rf.max(gf).max(bf);
    let min = rf.min(gf).min(bf);
    let l = (max + min) / 2.0;
    let (h, s) = if (max - min).abs() < f64::EPSILON {
        (0.0, 0.0)
    } else {
        let d = max - min;
        let s = if l > 0.5 { d / (2.0 - max - min) } else { d / (max + min) };
        let h = if max == rf {
            (gf - bf) / d + if gf < bf { 6.0 } else { 0.0 }
        } else if max == gf {
            (bf - rf) / d + 2.0
        } else {
            (rf - gf) / d + 4.0
        };
        (h / 6.0, s)
    };
    ((h * 360.0).round() as u32, (s * 100.0).round() as u32, (l * 100.0).round() as u32)
}

/// 接受 #hex / rgb(r,g,b)，输出 HEX / RGB / HSL。
#[tauri::command]
pub fn color_convert(input: String) -> Result<String, String> {
    let s = input.trim();
    if s.is_empty() {
        return Ok(String::new());
    }
    let (r, g, b) = parse_hex(s)
        .or_else(|| parse_rgb(s))
        .ok_or_else(|| "无法识别的颜色（支持 #RRGGBB / #RGB / rgb(r,g,b)）".to_string())?;
    let (h, sa, l) = to_hsl(r, g, b);
    Ok(format!(
        "HEX  #{r:02x}{g:02x}{b:02x}\nRGB  rgb({r}, {g}, {b})\nHSL  hsl({h}, {sa}%, {l}%)"
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hex_to_all() {
        let out = color_convert("#ff0000".into()).unwrap();
        assert!(out.contains("RGB  rgb(255, 0, 0)"));
        assert!(out.contains("HSL  hsl(0, 100%, 50%)"));
    }

    #[test]
    fn short_hex() {
        let out = color_convert("#0f0".into()).unwrap();
        assert!(out.contains("HEX  #00ff00"));
    }

    #[test]
    fn rgb_input() {
        let out = color_convert("rgb(0, 0, 255)".into()).unwrap();
        assert!(out.contains("HEX  #0000ff"));
    }

    #[test]
    fn invalid() {
        assert!(color_convert("not-a-color".into()).is_err());
    }
}
