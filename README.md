# cleanup
Cleanup your workspaces.

IDEA: Cleanup is a project to cleanup your workspaces by placing a .cleanup file.

The .cleanup file contains directories or files (paths) that can be cleaned/deleted, since the are not mandatory or just need to build the project.

Examples:
 - node_modules with node, npm, yarn
 - target with maven
 - build with intelij IDEA
 - ...
 
The runner will run through the directories and search vor .cleanup files, read its content and delete the paths.

This way, it is easy to cleanup your workspaces, expecially if you have many and get back the (disk) space you need.
