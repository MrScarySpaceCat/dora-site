use std::path::PathBuf;

#[derive(Clone)]
pub struct Config {
    pub bind_addr: &'static str,
    pub templates_dir: PathBuf,
    pub static_dir: PathBuf,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            bind_addr: "0.0.0.0:3000",
            templates_dir: PathBuf::from("./templates"),
            static_dir: PathBuf::from("./static"),
        }
    }
}
