#!/bin/bash
for i in {0..66}
do
   node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096  index.js $i
done