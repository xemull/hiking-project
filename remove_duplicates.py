#!/usr/bin/env python3
import os
import hashlib
from collections import defaultdict
from pathlib import Path

def get_file_hash(filepath):
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def remove_duplicates(directory):
    """Remove duplicate files, keeping the one with shortest filename"""

    # Dictionary to store hash -> list of files
    hash_to_files = defaultdict(list)

    # Find all image files and calculate their hashes
    print("Scanning for image files...")
    uploads_dir = Path(directory) / "public" / "uploads"

    if not uploads_dir.exists():
        print(f"Directory {uploads_dir} does not exist!")
        return

    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}

    for file_path in uploads_dir.rglob('*'):
        if file_path.is_file() and file_path.suffix in image_extensions:
            try:
                file_hash = get_file_hash(file_path)
                hash_to_files[file_hash].append(file_path)
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

    # Process duplicates
    removed_count = 0
    duplicate_sets = 0

    for file_hash, files in hash_to_files.items():
        if len(files) > 1:
            duplicate_sets += 1
            print(f"\nDuplicate set {duplicate_sets} (hash: {file_hash[:8]}...):")

            # Sort by filename length, keep shortest
            files.sort(key=lambda x: len(x.name))
            keep_file = files[0]

            print(f"  Keeping: {keep_file.name}")

            # Remove all others
            for file_to_remove in files[1:]:
                try:
                    print(f"  Removing: {file_to_remove.name}")
                    file_to_remove.unlink()
                    removed_count += 1
                except Exception as e:
                    print(f"  Error removing {file_to_remove}: {e}")

    print(f"\nCompleted!")
    print(f"Found {duplicate_sets} sets of duplicates")
    print(f"Removed {removed_count} duplicate files")

if __name__ == "__main__":
    directory = r"C:\Users\xemul\trailhead\tmb-cms-clean"
    remove_duplicates(directory)