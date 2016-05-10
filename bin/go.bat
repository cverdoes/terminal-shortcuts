@echo off
for /f "usebackq delims=" %%x in (`lookup %*`) do cd %%x