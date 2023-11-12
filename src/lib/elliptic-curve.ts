import { Snarky } from '../snarky.js';
import { ForeignAffine, ForeignField, ForeignFieldVar, createForeignField } from './foreign-field.js';
import { Field } from "./field.js";

export { EllipticCurve, ForeignGroup }

type EllipticCurve = [a: string, b: string, modulus: string, genX: string, genY: string, order: string];
class ForeignGroup {
    static curve: EllipticCurve

    x: ForeignField
    y: ForeignField

    constructor(x: ForeignField, y: ForeignField) {
        this.x = x;
        this.y = y;
    }

    add(other: ForeignGroup) {
        let left: ForeignAffine = [this.x.value, this.y.value];
        let right: ForeignAffine = [other.x.value, other.y.value];
        let [x, y] = Snarky.foreignGroup.add(left, right, ForeignGroup.curve);
        let ForeignGroupField = createForeignField(BigInt(ForeignGroup.curve[2]));
        return new ForeignGroup(new ForeignGroupField(x), new ForeignGroupField(y));
    }

    static toFields(g: ForeignGroup) {
        return g.toFields();
    }

    toFields() {
        return [this.x.toFields(), this.y.toFields()].flat();
    }

    static toAuxiliary() {
        return [];
    }

    static fromFields(fields: Field[]) {
        let ForeignGroupField = createForeignField(BigInt(ForeignGroup.curve[2]));
        let [x, y, z, a, b, c] = fields;
        return new ForeignGroup(
          ForeignGroupField.fromFields([x, y, z]),
          ForeignGroupField.fromFields([a, b, c]),
        );
    }

    static sizeInFields() {
        return 6;
    }

    assertValidElement() {
        this.x.assertValidElement();
        this.y.assertValidElement();
    }

    static check(g: ForeignGroup) {
        g.assertValidElement();
    }
}
