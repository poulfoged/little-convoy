// Type definitions for Grunt JS
// Project: http://gruntjs.com/
// Definitions by: Basarat Ali Syed <https://github.com/basarat>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


////////////////
/// To add plugins update the IGruntConfig using open ended interface syntax
////////////////
interface IGruntConfig {
    pkg?: any;
}


////////////////
// Main Grunt object 
// http://gruntjs.com/api/grunt
////////////////
interface IGrunt {
    // Config
    config: IGruntConfigObject;
    initConfig(config?: IGruntConfig);


    // Tasks
    task: any;
    // Creating
    registerTask: Function;
    registerMultiTask: Function;
    renameTask: Function;
    // Loading
    loadTasks: Function;
    loadNpmTasks: Function;

    // Errors
    warn: Function;
    fatal: Function;

    // Misc: 
    package: any;
    version: any;

    // File
    file: IGruntFileObject;

    // Event
    event: any;
    // Fail
    fail: any;
    // Log
    log: any;
    // Options
    option: any;
    // Template
    template: any;
    // Util
    util: any;
}

////////////////
/// Grunt Config object
/// http://gruntjs.com/api/grunt.config#accessing-config-data
////////////////
interface IGruntConfigObject {
    (...param: any[]): any;
    init: (config?: IGruntConfig) => void;
    get: Function;
    process: Function;
    getRaw: Function;
    set: Function;
    escape: (propString: string) => void;
    requires: Function;
}

////////////////
// Grunt File object
// http://gruntjs.com/api/grunt.file
////////////////
interface IGruntFileObjectOptionsSimple {
    encoding?: string;
}
interface IGruntFileObjectOptions extends IGruntFileObjectOptionsSimple {
    process?: Function;
    noProcess?: any;
}
interface IGruntFileObject {

    // Character encoding
    defaultEncoding: string;

    // Reading and writing
    read(filepath, options?: IGruntFileObjectOptionsSimple);
    readJSON(filepath, options?: IGruntFileObjectOptionsSimple);
    readYAML(filepath, options?: IGruntFileObjectOptionsSimple);
    write(filepath, contents, options?: IGruntFileObjectOptionsSimple);
    copy(srcpath, destpath, options?: IGruntFileObjectOptions);
    delete(filepath, options?: { force?: boolean; });

    // Directories
    mkdir(dirpath, mode?);
    recurse(rootdir, callback);

    // Globbing patterns
    expand(patterns);
    expand(options, patterns);
    expandMapping(patterns, dest, options?);
    match(patterns, filepaths);
    match(options, patterns, filepaths);
    isMatch(patterns, filepaths): boolean;
    isMatch(options, patterns, filepaths): boolean;

    // file types
    exists(...paths: any[]);
    isLink(...paths: any[]);
    isDir(...paths: any[]);
    isFile(...paths: any[]);

    // paths
    isPathAbsolute(...paths: any[]);
    arePathsEquivalent(...paths: any[]);
    isPathCwd(...paths: any[]);
    setBase(...paths: any[]);

    // External libraries
    glob: any;
    minimatch: any;
    findup: any;
}


////////////////
/// Globally called export function module.exports
////////////////
declare var module: {
    exports(grunt: IGrunt): void;
}

////////////////
/// Sample grunt plugin definition: 
/// uglify : https://github.com/gruntjs/grunt-contrib-uglify
////////////////
interface IGruntUglifyOptions {
    mangle?: any; // bool / object 
    compress?: any; // bool / object
    beautify?: any; // bool / object
    report?: any; // false / 'min' / 'gzip'
    sourceMap?: any; // String / Function 
    sourceMapRoot?: string;
    sourceMapIn?: string;
    sourceMappingURL?: any; // String / Function
    sourceMapPrefix?: number;
    wrap?: string;
    exportAll?: boolean;
    preserveComments?: any; // bool / string / function 
    banner?: string;
}
interface IGruntConfig {
    uglify?: {
        options?: IGruntUglifyOptions;
        [target: string]: {
            files?: { [output: string]: string[]; };
        };
    };
}


////////////////
/// Sample grunt plugin definition: 
/// less : https://npmjs.org/package/grunt-contrib-less
////////////////
interface IGruntLessOptions {
    /**
    * Directory of input file.
    */
    paths?: any; // String / Array
    compress?: boolean;
    yuicompress?: boolean;
    optimization?: number;
    strictImports?: boolean;
    dumpLineNumbers?: string;
}

interface IGruntLessConfig {
    options?: IGruntLessOptions;
    files?: { [output: string]: string; };
}

interface IGruntConfig {
    less?: {
        [target: string]: IGruntLessConfig;
    };
}

////////////////
/// Sample grunt plugin definition: 
/// Recess : https://github.com/sindresorhus/grunt-recess
////////////////
interface IGruntRecessConfig {
    compile?: boolean;
    compress?: boolean;
    noIDS?: boolean;
    noJSPrefix?: boolean;
    noOverqualifying?: boolean;
    noUnderscores?: boolean;
    noUniversalSelectors?: boolean;
    prefixWhitespace?: boolean;
    strictPropertyOrder?: boolean;
    stripColors?: boolean;
    zeroUnits?: boolean;
}

interface IGruntConfig {
    recess?: {
        options?: IGruntRecessConfig;
    };
}

function setup(grunt) {
    var pkg = grunt.file.readJSON("package.json")

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        //copy: {
        //    bootstrap: {
        //        //expand: true,
        //        //flatten: true,
        //        src: ['./node_modules/almond/almond.js'],
        //        dest: './',
        //        filter: 'isFile'
        //    }
        //},
        clean: {
            build: {
                src: ['build\**', 'temp']
            },
            temp: {
                src: ['temp']
            },
        },
        typescript: {
            base: {
                src: ['*.ts', 'LittleConvoy.Js/**/*.ts'],
                options: {
                    'module': 'amd', //or commonjs
                    target: 'es5', //or es3
                    base_path: '',
                    sourcemap: false,
                    declaration: false
                }
            },
            definition: {
                src: ['LittleConvoy.Js/**/*.ts'],
                dest: 'temp',
                options: {
                    target: 'es5', //or es3
                    base_path: '',
                    sourcemap: false,
                    declaration: true
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './LittleConvoy.Js',
                    name: '../node_modules/almond/almond',
                    out: "build/littleConvoy.js", // temp becouse it appears to empty directory
                    almond: true,
                    include: ['LittleConvoy.Client', 'LittleConvoy.Transports.HiddenFrame']
                }
            }
        },
        copy: {
            client: {
                src: ['Temp/LittleConvoy.Js/LittleConvoy.Interfaces.d.ts', 'Temp/LittleConvoy.Js/lib/PromiseAPI.d.ts'],
                dest: 'build/typings/',
                filter: 'isFile',
                flatten: true,
                expand: true
            }
        },
        //processhtml: {
        //    dist: {
        //        files: {
        //            'build/demo.html': ['LittleConvoy.Js/demo.html']
        //        }
        //    }
        //},
        nugetpack: {
            dist: {
                src: 'Package.nuspec',
                dest: 'build',

                options: {
                    version: pkg.version
                }
            }
        },
        nugetpush: {
            dist: {
                src: 'build/*.nupkg',
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ["clean:build", "typescript", "requirejs", "copy:client", "nugetpack", "clean:temp"]);

    grunt.registerTask('dist', ["clean:build", "typescript", "requirejs", "copy:client", "nugetpack", "clean:temp", "nugetpush"]);
}


(module).exports = setup;
