export class Container {
  constructor() {
    this.services = {};
    this.instances = {};
  }

  register(key, factory) {
    if (this.services[key]) {
      throw new Error('service-duplicated: ' + key);
    }

    this.services[key] = factory;
  }

  get(key) {
    if (!this.services[key]) {
      throw new Error('service-not-found: ' + key);
    }

    if (!this.instances[key]) {
      this.instances[key] = this.services[key](this);
    }

    return this.instances[key];
  }
}
