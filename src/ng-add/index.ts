import { Rule, SchematicContext, Tree, chain, noop, mergeWith, apply, url, template } from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(options: any): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependency(), mergeWith(apply(url('./files'), [
      template({
        INDEX: options.index,
        name: options.name,
      }),
    ]))
  ])
}

// install dependency to package.json and install
function addPackageJsonDependency() {
  return ( _host: Tree, _context:SchematicContext) => {
    if(_host.exists('package.json')){
        const jsonStr = _host.read('package.json') !.toString('utf-8');
        const json = JSON.parse(jsonStr);

        const type = 'dependencies';
        if(!json[type]){
          json[type]= {};
        }

        const pkg = 'nguniversal-logger';
        const version = 'latest';
        if(!json[type][pkg]) {
          json[type][pkg]= version;
        }
        _host.overwrite('package.json', JSON.stringify(json, null, 2));
        _context.logger.log('info', 'Added nguniversal-logger as dependency');

        _context.addTask(new NodePackageInstallTask());
    }
    return _host;
  }
  
}