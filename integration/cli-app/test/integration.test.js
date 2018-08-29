'use strict'
process.env.NODE_ENV = 'test'

require('chai')
  .use(require('zos-lib').assertions)
  .should();

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(cmd) {
  return execSync(cmd, { cwd: path.resolve(__dirname, '../workdir-cli-app') });
}

function copy(src, target) {
  fs.copyFileSync(path.resolve(__dirname, `../templates/${src}`), path.resolve(__dirname, `../workdir-cli-app/${target}`));
}

function getProxyAddress(name, index, network) {
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../workdir-cli-app/zos.${network}.json`)))
  return data.proxies[name][index].address
}

contract('cli-app', function () {

  describe('setup', function () {
    it('cleaning up project folder', function () {
      run('rm zos.*')
    });

    it('setup project', function () {
      copy('package.json.template', 'package.json')
      run('lerna bootstrap --scope=workdir-cli-app')
    });

    it('initialize zos', function () {
      run('npx zos init cli-app 0.5.0')
    })

    it('adds dependencies', function () {
      run('npx zos link openzeppelin-zos@^1.9.0')
    })

    it('adds contracts', function () {
      run('npx zos add Foo')
      run('npx zos add Bar')
      run('npx zos add Baz')
      run('npx zos add TokenExchange:Exchange')
    })

    it('compiles', function () {
      run('npx truffle compile')
    })

    it('pushes to local geth network', function () {
      run('npx zos push --network gethdev --deploy-stdlib --skip-compile')
    })

    it('creates an instance', async function () {
      run('npx zos create Foo --network gethdev')
      const Foo = artifacts.require('Foo') // TODO: Symlink contracts to workdir-cli-app?
      const foo = await Foo.at(getProxyAddress('Foo', 0, 'gethdev'))
      const said = await foo.say()
      said.should.eq('Foo')
    })
  })
});
