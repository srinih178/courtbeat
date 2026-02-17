#!/bin/bash

# Extract and create individual module files from ALL_MODULES.ts
FILE="ALL_MODULES.ts"

# Create schedules module files
mkdir -p schedules
sed -n '/\/\/ schedules.module.ts/,/export class SchedulesModule/p' $FILE | tail -n +2 > schedules/schedules.module.ts
sed -n '/\/\/ schedules.service.ts/,/^}$/p' $FILE | grep -A 1000 "schedules.service.ts" | grep -B 1000 "^}$" | head -n -1 | tail -n +2 > schedules/schedules.service.ts
sed -n '/\/\/ schedules.controller.ts/,/^}$/p' $FILE | grep -A 1000 "schedules.controller.ts" | grep -B 1000 "^}$" | head -n -1 | tail -n +2 > schedules/schedules.controller.ts

# Create analytics module files
mkdir -p analytics
sed -n '/\/\/ analytics.module.ts/,/export class AnalyticsModule/p' $FILE | tail -n +2 > analytics/analytics.module.ts
sed -n '/\/\/ analytics.service.ts/,/export class AnalyticsService/,/^  }$/p' $FILE > analytics/analytics.service.ts
sed -n '/\/\/ analytics.controller.ts/,/ANALYTICS MODULE/,/^}$/p' $FILE > analytics/analytics.controller.ts

# Create auth module files
mkdir -p auth
sed -n '/\/\/ auth.module.ts/,/export class AuthModule/p' $FILE | tail -n +2 > auth/auth.module.ts  
sed -n '/\/\/ auth.service.ts/,/export class AuthService/,/^  }$/p' $FILE > auth/auth.service.ts
sed -n '/\/\/ auth.controller.ts/,/AUTH MODULE/,/^}$/p' $FILE > auth/auth.controller.ts

# Create music module files  
mkdir -p music
sed -n '/\/\/ music.module.ts/,/export class MusicModule/p' $FILE | tail -n +2 > music/music.module.ts
sed -n '/\/\/ music.service.ts/,/export class MusicService/,/^  }$/p' $FILE > music/music.service.ts
sed -n '/\/\/ music.controller.ts/,/^}$/p' $FILE | grep -A 1000 "music.controller.ts" | tail -n +2 > music/music.controller.ts

echo "Module files created successfully!"
