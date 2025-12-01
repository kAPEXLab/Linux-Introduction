## **man** 

The man command opens the system manual pages for commands and programs

`man <command>` 

* `man ls` - View the ls manual
* `man cp` - View the cp manual
* `man -k ifconfig` - search all man files for ifconfig
* `man -k "copy"` - search all man files for the string mentioned in quote

## **cd**

Change Directory
* `cd /` - go to the root directory
* `cd dict_name` - go to directory having name dict_name
* `cd ..` - coe out of the current directory

## **sudo su**
* Allows a user to run commands as root
* The user must have permissions to do this
* The password required is the password for this user

## **id**
* Show the user you are logged in as and the groups you are part of

## **exit**
* exit and close the terminal

## **pwd**
* Print working directory

## **ls**
* Lists files and directories in the current directory
* `ls --all` - Shows all files including hidden files
* `ls -l` - adding the -l option produces the long listing format (permissions, ownership, file size, and timestamps)

## **mkdir**
* Make directory `mkdir dict_name`
* `mkdir test1` - creates directory with name test1 in the currect working directory
* `mkdir test1/subtest1` - creates directory and subdirectory in a single command
* `mkdir test1 test2 test3` - creates multiple dictories in the current working directlry

## **rmdir**
* Remove directory `rmdir dict_name`
* `rmdir test1` - removes directory with name test1 from the currect working directory


## **touch**
* Creates a new file
* `touch filename`
* `touch test.txt` - Creates a new file called text.txt

## **cat**
* View the contents of a file
* `cat filename`
* `cat test.txt` - displayes contents of test.txt file

## **cp**
* copy `cp source destination`
* `cp test.txt test2.txt` - Copies text.txt to a new file called text2.txt

## **mv**
* move `mv sourcefile destinationPath`
* `mv test.txt test2/` - Moves text.txt to a different directory
* `mv *.txt test2/` - Moves all .txt to a different directory
