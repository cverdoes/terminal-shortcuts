@echo off
for /f "usebackq delims=" %%x in (`ts-lookup %*`) do cd %%x
