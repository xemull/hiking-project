#!/bin/bash

# Script to remove duplicate image files, keeping the shortest filename
cd "C:\Users\xemul\trailhead\tmb-cms-clean"

echo "Finding and removing duplicate files..."
removed_count=0

# Find all image files, get MD5 hashes, and process duplicates
find public/uploads -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.JPG" \) -exec md5sum {} + | \
sort | \
while IFS= read -r line; do
    hash=$(echo "$line" | cut -d' ' -f1)
    file=$(echo "$line" | cut -d'*' -f2)

    # Store in temporary file for processing
    echo "$hash|$file" >> /tmp/all_hashes.txt
done

# Process duplicates - keep shortest filename, remove others
if [ -f /tmp/all_hashes.txt ]; then
    sort /tmp/all_hashes.txt | \
    while IFS='|' read -r hash file; do
        # Get all files with same hash
        grep "^$hash|" /tmp/all_hashes.txt | cut -d'|' -f2 > /tmp/duplicate_set.txt

        # Count files in this set
        count=$(wc -l < /tmp/duplicate_set.txt)

        if [ "$count" -gt 1 ]; then
            echo "Processing duplicate set (hash: $hash):"

            # Sort by filename length, keep shortest
            sort -k1,1 /tmp/duplicate_set.txt | head -1 > /tmp/keep_file.txt
            keep_file=$(cat /tmp/keep_file.txt)
            echo "  Keeping: $keep_file"

            # Remove all others
            while IFS= read -r dup_file; do
                if [ "$dup_file" != "$keep_file" ]; then
                    if [ -f "$dup_file" ]; then
                        echo "  Removing: $dup_file"
                        rm "$dup_file"
                        ((removed_count++))
                    fi
                fi
            done < /tmp/duplicate_set.txt

            echo ""
        fi
    done
fi

echo "Removed $removed_count duplicate files"

# Cleanup
rm -f /tmp/all_hashes.txt /tmp/duplicate_set.txt /tmp/keep_file.txt