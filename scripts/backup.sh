#!/bin/bash

# Setting up directories
SUBDIR=backups
DIR=/mnt/HD1/$SUBDIR

# Check if backup directory exists
if [ ! -d "$DIR" ];
   then
      echo "Backup directory $DIR doesn't exist, creating it now!"
      mkdir $DIR
fi

# Create a filename with datestamp for our current backup (without .img suffix)
OFILE="$DIR/backup_$(date +%Y-%m-%d_%H-%M-%S)"

# Create final filename, with suffix
OFILEFINAL=$OFILE.img

# First sync disks
sync; sync

# Begin the backup process, should take about 1 hour from 8Gb SD card to HDD
echo "Starting backup process of SD card to hard drive."
echo "This will take some time depending on your SD card size and read performance. Please wait..."
dd if="/dev/mmcblk0" of=$OFILE bs=1M conv=sync,noerror

# Wait for DD to finish and catch result
RESULT=$?

# If command has completed successfully, tar the backup and exit
if [ $RESULT = 0 ];
   then
      echo "Successful backup generated!"
      mv $OFILE $OFILEFINAL
      echo "Backup is being tarred. Please wait..."
      tar zcf $OFILEFINAL.tar.gz $OFILEFINAL
      rm -rf $OFILEFINAL
      echo "Backup process completed! FILE: $OFILEFINAL.tar.gz"
      exit 0
# Else remove attempted backup file
   else
      echo "Backup process failed! Previous backup files untouched."
      echo "Please check if there is sufficient space on the HDD."
      rm -f $OFILE
      exit 1
fi