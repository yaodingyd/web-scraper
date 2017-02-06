#!/bin/bash
start=${1:-0}
end=${2:-66}
for ((i=$start; i<=$end; i++))
do
  node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096  index.js $i -- nodup
  if [ $? -eq 0 ] 
  then
    echo "process exit 0"
  else
    echo "process exit 1"
    sleep 10m
    i=$i-1
  fi
done