use quick_xml::events::Event;
use quick_xml::reader::Reader;
use quick_xml::writer::Writer;

#[tauri::command]
pub fn xml_format(input: String) -> Result<String, String> {
    if input.trim().is_empty() {
        return Ok(String::new());
    }
    let mut reader = Reader::from_str(input.trim());
    reader.config_mut().trim_text(true);

    let mut writer = Writer::new_with_indent(Vec::new(), b' ', 2);
    loop {
        match reader.read_event() {
            Ok(Event::Eof) => break,
            Ok(event) => writer
                .write_event(event)
                .map_err(|e| format!("XML 写入失败: {e}"))?,
            Err(e) => return Err(format!("无效的 XML: {e}")),
        }
    }

    String::from_utf8(writer.into_inner()).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn indents() {
        let out = xml_format("<a><b>x</b></a>".into()).unwrap();
        assert!(out.contains("<a>\n"));
        assert!(out.contains("  <b>x</b>"));
    }

    #[test]
    fn invalid() {
        assert!(xml_format("<a><b></a>".into()).is_err());
    }
}
