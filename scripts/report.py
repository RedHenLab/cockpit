#!/bin/usr/python3 
"""
  Capture Station Report Generation Script
  Author: Aniruddha Mysore
  Repository: https://github.com/animysore/cockpit
  Version: 1
  Requirements: 
    - python 3
    - hdhomerun (hdhomerun_config command must be present)
    - smartmontools (smartctl command must be present)
"""
import sys
import json
import pprint
import subprocess

data = { 
    'storage': {
        'disks' : [],
        'cards' : []
    },
    'security': { 
        'failed_login': 0,
    },
    'hdhomerun_devices': [],
    'errors': []
}

"""
 Use `df` command to get filesystem usage 
 Filter disks and cards connected and save disk usage stats 
"""
out = subprocess.Popen(['df'],stdout=subprocess.PIPE)
stdout, stderr = out.communicate()
stdout = stdout.decode('utf8')

for i,row in enumerate(stdout.split('\n')):
    # skip first line
    if i==0: continue 

    fields = row.split()

    # skip last line
    if len(fields) == 0: continue

    fsname = fields[0]
    type = None

    if fsname.startswith('/dev/sda'): type = 'disks'
    if fsname.startswith('/dev/mmc'): type = 'cards'

    if type: 
        data['storage'][type].append({ 
            'name': fields[0],
            'available': fields[2],
            'used': fields[3]
        })

"""
 Read `/var/log/auth.log` to get failed login attempts
"""
out = subprocess.Popen(
    ['grep', "-i",  "failed", '/var/log/auth.log'], 
    stdout=subprocess.PIPE
)
stdout, stderr = out.communicate()
stdout = stdout.decode('utf8')

data['security']['failed_login'] = len(stdout.split('\n'))


out = subprocess.Popen(
    ['which', 'hdhomerun_config'], 
    stdout=subprocess.PIPE
)    
stdout, stderr = out.communicate()
stdout = stdout.decode('utf8')

if stdout:

    out = subprocess.Popen(
        ['hdhomerun_config', "discover"], 
        stdout=subprocess.PIPE
    )
    stdout, stderr = out.communicate()
    stdout = stdout.decode('utf8')

    if (stdout!='no devices found'):
        for row in stdout.split('\n'):
            fields = row.split()

            #skip last line
            if len(fields) == 0: continue 

            data['hdhomerun_devices'].append({
                'id': fields[2],
                'ip': fields[5]
            })
else:
    print('hdhomerun_config not found.\nSkipping HDHomeRun health check.')

pp = pprint.PrettyPrinter()
pp.pprint(data)

with open('report.json','w') as file:
    json.dump(data,file)
    print('Successfully saved to report.json')
