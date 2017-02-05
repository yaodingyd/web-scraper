#!/bin/bash
start=${1:-0}
end=${2:-66}
for ((i=$start; i<=$end; i++))
do
  node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096  index.js $i -- nodup
done