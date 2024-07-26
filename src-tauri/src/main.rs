// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod terminal;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn describe_instances(search_name: &str) -> String {
    let filter_arg = format!("Name=tag:Name,Values={}", search_name);
    let query_arg = format!(
        "Reservations[*].Instances[*].{{Instance:InstanceId,AZ:Placement.AvailabilityZone,Name:Tags[?Key==`Name`]|[0].Value,PublicIpAddress:PublicIpAddress,PrivateIpAddress:PrivateIpAddress,State:State.Name,Type:InstanceType,LaunchTime:LaunchTime,PublicDnsName:PublicDnsName}}"
    );
    let args = [
        "aws",
        "ec2",
        "describe-instances",
        "--filters",
        &filter_arg,
        "--query",
        &query_arg,
        "--output",
        "json",
        "--profile",
        "abner"
    ];

    if let Ok(output) = terminal::execute_command_terminal_fallback(&args) {
        if let Ok(output_str) = String::from_utf8(output.stdout).map_err(|e| e.to_string()) {
            return output_str.to_string();
        }
    }

    String::new()
}

#[tauri::command]
fn start_aws_session_ssm(id: String) {
    let args = vec!["aws", "ssm", "start-session", "--target", &id];

    match terminal::execute_command_terminal(&args) {
        Ok(output) => println!("Command executed successfully: {:?}", output),
        Err(err) => eprintln!("Error executing command: {:?}", err),
    }
}

#[tauri::command]
fn start_ssh_session(ip: String, pem_path: String) {
     let ssh_command = format!("ssh -i {} ec2-user@{}", pem_path, ip);
     let args: Vec<&str> = ssh_command.split_whitespace().collect();

     match terminal::execute_command_terminal(&args) {
         Ok(output) => println!("Command executed successfully: {:?}", output),
         Err(err) => eprintln!("Error executing command: {:?}", err),
     }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            describe_instances,
            start_aws_session_ssm,
            start_ssh_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
