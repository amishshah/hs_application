import { Applicant } from "../models/db";
import { BaseRepository } from "./baseRepository";
import { injectable } from "inversify";
import { Repository } from "typeorm";

@injectable()
export class ApplicantRepository extends BaseRepository<Applicant> {
  public getRepository(): Repository<Applicant> {
    return super.connect(Applicant);
  }
}
