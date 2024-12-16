import { Dependency } from "../core/dependency-resolver/dependency-resolver";

export class Configurations extends Dependency {
    private environment: string;

    constructor(environment: string) {
        super('Configurations');
        this.environment = environment;
    }
}