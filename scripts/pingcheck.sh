#!/bin/bash
#
# Ping logger
#
# Author: Aniruddha Mysore
# Repository: https://github.com/animysore/cockpit
# Written: 2019-06-08
#
###

LOGFILE="$HOME/Documents/GSOC/cockpit/scripts/pings.log"

# Host address to ping
PINGHOST="google.com"
# How many packets to send
COUNT=5

output=`ping -qc $COUNT $PINGHOST`
ec=$? # Returned error code

# Logs the current timmestamp
ts=`date +%s`

if [[ $ec != 0 ]]
then
    `printf "%s\tDOWN\n" "$ts" >> $LOGFILE`
else
    loss=`awk '/[[:digit:]]{1,2}%/ {gsub(/%/, ""); print $6}' <<< $output`
    if [[ $loss > 0 ]]
    then
        `printf "%s\tDOWN\n" "$ts" >> $LOGFILE`
    else
        `printf "%s\tUP\n" "$ts" >> $LOGFILE`
    fi
fi
