use md5::Md5;
use sha1::Sha1;
use sha2::{Digest, Sha256, Sha512};

fn digest<D: Digest>(input: &[u8]) -> String {
    let mut hasher = D::new();
    hasher.update(input);
    hex::encode(hasher.finalize())
}

/// algo: "md5" | "sha1" | "sha256" | "sha512"
#[tauri::command]
pub fn hash_text(input: String, algo: String) -> Result<String, String> {
    let bytes = input.as_bytes();
    match algo.as_str() {
        "md5" => Ok(digest::<Md5>(bytes)),
        "sha1" => Ok(digest::<Sha1>(bytes)),
        "sha256" => Ok(digest::<Sha256>(bytes)),
        "sha512" => Ok(digest::<Sha512>(bytes)),
        other => Err(format!("不支持的算法: {other}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn known_vectors() {
        assert_eq!(
            hash_text("abc".into(), "md5".into()).unwrap(),
            "900150983cd24fb0d6963f7d28e17f72"
        );
        assert_eq!(
            hash_text("abc".into(), "sha256".into()).unwrap(),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }

    #[test]
    fn unknown_algo() {
        assert!(hash_text("x".into(), "crc32".into()).is_err());
    }
}
