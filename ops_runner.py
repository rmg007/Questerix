#!/usr/bin/env python3
"""
Local DevOps pipeline runner for Questerix project.
Executes commands from JSON manifest files without user interaction.
"""

import json
import subprocess
import sys
import os
import time
from pathlib import Path
from typing import List, Dict, Any

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
except ImportError:
    print("Warning: watchdog not installed. Watch mode will not work.")
    print("Install with: pip install watchdog")
    Observer = None
    FileSystemEventHandler = None


def execute_manifest(manifest_path: str) -> bool:
    """
    Execute commands from a JSON manifest file.
    
    Args:
        manifest_path: Path to the JSON file containing commands
        
    Returns:
        True if all commands executed successfully, False otherwise
    """
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
    except FileNotFoundError:
        print(f"Error: Manifest file not found: {manifest_path}")
        return False
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in manifest file: {e}")
        return False
    
    if not isinstance(manifest, list):
        print("Error: Manifest must be a JSON array of command objects")
        return False
    
    success = True
    for idx, task in enumerate(manifest, 1):
        if not isinstance(task, dict):
            print(f"Warning: Task {idx} is not a dictionary, skipping")
            continue
        
        command = task.get('command')
        cwd = task.get('cwd')
        description = task.get('description', f'Task {idx}')
        
        if not command:
            print(f"Warning: Task {idx} missing 'command' field, skipping")
            continue
        
        print(f"[{idx}/{len(manifest)}] {description}")
        print(f"  Executing: {command}")
        if cwd:
            print(f"  Working directory: {cwd}")
        
        try:
            # Execute command without user interaction
            # check=True raises CalledProcessError on non-zero exit
            result = subprocess.run(
                command,
                shell=True,
                cwd=cwd if cwd else None,
                check=True,
                capture_output=False,  # Show output in real-time
                text=True
            )
            print(f"  ✓ Completed successfully\n")
        except subprocess.CalledProcessError as e:
            print(f"  ✗ Failed with exit code {e.returncode}\n")
            success = False
        except Exception as e:
            print(f"  ✗ Error executing command: {e}\n")
            success = False
    
    return success


class TaskFileHandler(FileSystemEventHandler):
    """Handler for detecting new tasks.json files."""
    
    def __init__(self, watch_dir: Path):
        self.watch_dir = watch_dir
        self.processed_files = set()
    
    def on_created(self, event):
        """Handle file creation events."""
        if event.is_directory:
            return
        
        file_path = Path(event.src_path)
        if file_path.name == 'tasks.json':
            # Small delay to ensure file is fully written
            time.sleep(0.5)
            self.process_file(file_path)
    
    def on_modified(self, event):
        """Handle file modification events."""
        if event.is_directory:
            return
        
        file_path = Path(event.src_path)
        if file_path.name == 'tasks.json':
            # Small delay to ensure file is fully written
            time.sleep(0.5)
            self.process_file(file_path)
    
    def process_file(self, file_path: Path):
        """Process a tasks.json file if not already processed."""
        # Use absolute path as key to avoid duplicates
        abs_path = file_path.resolve()
        
        if abs_path in self.processed_files:
            return
        
        print(f"\n{'='*60}")
        print(f"Detected new tasks.json: {abs_path}")
        print(f"{'='*60}\n")
        
        success = execute_manifest(str(abs_path))
        
        if success:
            print(f"\n✓ Manifest executed successfully: {abs_path}")
        else:
            print(f"\n✗ Manifest execution failed: {abs_path}")
        
        # Mark as processed
        self.processed_files.add(abs_path)
        print(f"{'='*60}\n")


def watch_mode(watch_dir: str = '.'):
    """
    Watch a directory for new tasks.json files and execute them automatically.
    
    Args:
        watch_dir: Directory to watch for tasks.json files
    """
    if Observer is None:
        print("Error: Watch mode requires the 'watchdog' library.")
        print("Install it with: pip install watchdog")
        sys.exit(1)
    
    watch_path = Path(watch_dir).resolve()
    
    if not watch_path.exists():
        print(f"Error: Watch directory does not exist: {watch_path}")
        sys.exit(1)
    
    if not watch_path.is_dir():
        print(f"Error: Watch path is not a directory: {watch_path}")
        sys.exit(1)
    
    print(f"Watching directory: {watch_path}")
    print("Waiting for tasks.json files... (Press Ctrl+C to stop)\n")
    
    event_handler = TaskFileHandler(watch_path)
    observer = Observer()
    observer.schedule(event_handler, str(watch_path), recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nStopping watcher...")
        observer.stop()
    
    observer.join()
    print("Watcher stopped.")


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python ops_runner.py <tasks.json>     # Execute a specific manifest")
        print("  python ops_runner.py --watch [dir]    # Watch directory for tasks.json files")
        sys.exit(1)
    
    if sys.argv[1] == '--watch':
        watch_dir = sys.argv[2] if len(sys.argv) > 2 else '.'
        watch_mode(watch_dir)
    else:
        manifest_path = sys.argv[1]
        success = execute_manifest(manifest_path)
        sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
