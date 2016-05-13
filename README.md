# terminal-shortcuts [![npm version](https://badge.fury.io/js/terminal-shortcuts.svg)](https://badge.fury.io/js/terminal-shortcuts) [![Build Status](https://travis-ci.org/cverdoes/terminal-shortcuts.svg?branch=master)](https://travis-ci.org/cverdoes/terminal-shortcuts)
> Save time and keystrokes by defining shortcuts for often-visited paths when navigating folders in the terminal.

```shell
# assuming the following shortcuts:
#   docs:/Path/to/documents
#   proj:/Path/to/projects

/Some/random/path > ts docs

/Path/to/documents > ts proj

/Path/to/projects > _
```

## Getting Started
The toolkit consists of three parts

1. the `ts-lookup` tool
	- given a shortcut, this tool returns a target path
2. the `ts-add` tool
	- given a shortcut and a target, adds a shortcut to the shortcut file
3. batch and shell scripts
	- `ts` - batch script, acts like `cd` and changes directory to whatever the given shortcut expands to (windows only)
	- `ts-cd` / `ts-pushd` - shell script wrappers for `cd` and `pushd`, though these can't be run directly (read more below)

Install them all globally:

```shell
npm install terminal-shortcuts -g
```

Add some shortcuts:
```shell
> ts-add docs /Users/user/Documents
> ts-add proj /Users/user/Documents/projects
```

Test the setup in a terminal/console window: run `ts-lookup <shortcut>` and make sure it prints the corresponding target, e.g.:
```shell
> ts-lookup docs
/Users/user/Documents

> ts-lookup proj
/Users/user/Documents/projects

```

### Shell setup (Linux / OS X)
Because shell scripts run in a sub-shell when executed, they cannot change directory of the parent shell. To make the `ts-cd` and `ts-pushd` scripts work as intended, set up aliases that `source` the scripts:

```shell
# create aliases
/ > alias ts="source ts-cd"
/ > alias tsp="source ts-pushd"

# use alias to change directory using the ts-cd script:
/ > ts proj

# make sure we end up in the expected directory:
/Users/user/Documents/project >
```

If you use `bash`, add the aliases to `~/.bash_profile` to make them available in all shells. Also, feel free to use whatever aliases you like - I prefer `go` rather than `ts`, but I guess it might clash if you're programming with `go-lang`.

## Shortcut format
Define shortcuts in any of the following formats:

* `docs:/Users/user/Documents` - maps a shortcut, `docs` to a path `/Users/user/Documents`
* `proj:<docs>/projects` - maps a shortcut, `proj` to a path `/Users/user/Documents/projects` using another shortcut `docs` as base
* `src:<proj>/*/src` - maps a shortcut `src` to a path `/Users/user/Documents/projects/x/src` using the current working directory as a base, i.e:
	- `/Users/user/Documents/projects/project-a/src` if the `cwd` is anywhere below `/Users/user/Documents/projects/project-a`
	- `/Users/user/Documents/projects/project-b/src` if the `cwd` is anywhere below `/Users/user/Documents/projects/project-b`
	- very useful for projects that have a deep, but known, directory structure and you need to navigate wihtin it regardless of what project you're currently working in

Also:

* Any shortcut that is not found is treated as a literal folder name, so e.g. `ts-lookup bogus` will return `bogus`.
* Arguments can be "chained" so that e.g. `ts-lookup proj a dist docs` will return `/Users/user/Documents/projects/a/dist/docs`, assuming that path exists

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

#### 1.1.0
  * .shortcuts file now created if it doesn't exist
  * added command `ts-add` to add shortcuts from the command line

#### 1.0.0
  * Inital release