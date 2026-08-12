import "reflect-metadata";
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Cargo } from "./Cargo";
import { Lugar } from "./Lugar";

@Entity()
export class Candidato {
  @PrimaryColumn({ type: "varchar", length: 12 })
  ci!: string;

  @Column({ type: "varchar", length: 60 })
  nombres!: string;

  @Column({ type: "varchar", length: 30 })
  apellido1!: string;

  @Column({ type: "varchar", length: 40 })
  apellido2!: string;

  @Column({ type: "int" })
  cargo_id!: number;

  @Column({ type: "int" })
  lugar_id!: number;

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: "cargo_id" })
  cargo!: Cargo;

  @ManyToOne(() => Lugar)
  @JoinColumn({ name: "lugar_id" })
  lugar!: Lugar;
}
