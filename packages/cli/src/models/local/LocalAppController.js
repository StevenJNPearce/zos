import LocalBaseController from './LocalBaseController';
import NetworkAppController from '../network/NetworkAppController';
import Dependency from '../dependency/Dependency';

export default class LocalAppController extends LocalBaseController {
  async linkLib(libNameVersion, installLib = false) {
    if (libNameVersion) {
      const dependency = Dependency.fromNameWithVersion(libNameVersion)
      if (installLib) await dependency.install()
      this.packageFile.setDependency(dependency.name, dependency.requirement)
    }
  }

  unlinkLibs(libNames) {
    libNames
      .map(dep => Dependency.fromNameWithVersion(dep))
      .forEach(dep => this.packageFile.unsetDependency(dep.name))
  }

  onNetwork(network, txParams, networkFile = undefined) {
    return new NetworkAppController(this, network, txParams, networkFile);
  }
}
