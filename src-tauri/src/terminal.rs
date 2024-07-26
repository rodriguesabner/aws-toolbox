use std::env;
use std::process::{Child, Command, Output};

pub fn execute_command_terminal_fallback(args: &[&str]) -> Result<Output, std::io::Error> {
    Command::new(args[0]).args(&args[1..]).output()
}

pub fn execute_command_terminal(args: &[&str]) -> std::io::Result<Child> {
    let os = env::consts::OS;

    match os {
        "windows" => Command::new("cmd").args(&["/C"]).args(args).spawn(),
        "linux" => Command::new("gnome-terminal")
            .args(&["--"])
            .args(args)
            .spawn(),
        "macos" => Command::new("open")
            .args(&["-a", "Terminal"])
            .args(args)
            .spawn(),
        _ => Command::new("xterm").args(&["-e"]).args(args).spawn(),
    }
}

pub fn execute_command_terminal_debug(args: &[&str]) -> std::io::Result<()> {
    let output = Command::new(args[0]).args(&args[1..]).output()?;

    println!(
        "Command output:\n{}",
        String::from_utf8_lossy(&output.stdout)
    );
    println!(
        "Command error:\n{}",
        String::from_utf8_lossy(&output.stderr)
    );

    if !output.status.success() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Command failed with exit code: {}", output.status),
        ));
    }

    Ok(())
}
