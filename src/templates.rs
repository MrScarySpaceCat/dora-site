use std::path::Path;

use handlebars::Handlebars;

/// Register every `.html` file in `dir` as a Handlebars template.
/// The template name is the file stem (e.g. "index.html" → "index.html").
/// Adding a new template is just dropping a file in the directory.
pub fn register_all(hb: &mut Handlebars<'_>, dir: &Path) {
    let entries = std::fs::read_dir(dir)
        .unwrap_or_else(|e| panic!("Failed to read templates dir {:?}: {}", dir, e));

    for entry in entries.flatten() {
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) == Some("html") {
            let name = path
                .file_name()
                .and_then(|n| n.to_str())
                .expect("Template filename is not valid UTF-8");

            hb.register_template_file(name, &path)
                .unwrap_or_else(|e| panic!("Failed to register template {:?}: {}", path, e));
        }
    }
}
