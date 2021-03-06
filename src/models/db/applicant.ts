import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Min, IsDefined, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { ApplicantStatus } from "../../services/applications/applicantStatus";

export interface ApplicationMappingOptions {
  /**
   * Specifies if the property is optional in the application
   */
  isOptional?: boolean;

  /**
   * Specifies if the property has an "Other" option in the application form
   */
  hasOther?: boolean;

  /**
   * Specifies if the property is to be casted into a number
   */
  isNumeric?: boolean;
}

export const applicationMapping: Map<string, ApplicationMappingOptions> = new Map();
/**
 * Maps the applicant property to the application in a post request
 *
 * Include the properties that are found in the POST request
 */
export function ApplicationMapped(options?: ApplicationMappingOptions) {
  return function(object: Record<string, any>, propertyName: string): void {
    applicationMapping.set(propertyName, options);
  };
}

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { nullable: true, unique: true })
  @IsOptional()
  authId: string;

  @Column("integer")
  @IsDefined({ message: "The applicants age is required" })
  @IsInt()
  @Min(18, { message: "Minimum age is 18" })
  @ApplicationMapped({ isNumeric: true })
  age: number;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants gender is required" })
  @ApplicationMapped({ hasOther: true })
  gender: string;

  @Column("varchar", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true })
  nationality: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants country of origin is required" })
  @ApplicationMapped()
  country: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants city is required" })
  @ApplicationMapped()
  city: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants university is required" })
  @ApplicationMapped()
  university: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants degree is required" })
  @ApplicationMapped()
  degree: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants year of study is required" })
  @ApplicationMapped()
  yearOfStudy: string;

  @Column("varchar", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true })
  cv: string;

  @Column("varchar", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true, hasOther: true })
  workArea: string;

  @Column("varchar", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true })
  skills: string;

  @Column("integer", { nullable: true })
  @IsInt()
  @Min(0, { message: "Minimum number of hackathons is zero" })
  @IsOptional()
  @ApplicationMapped({ isOptional: true, isNumeric: true })
  hackathonCount: number;

  @Column("text", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true })
  whyChooseHacker: string;

  @Column("text", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true })
  pastProjects: string;

  @Column("text", { nullable: true })
  @IsOptional()
  @ApplicationMapped({ isOptional: true })
  hardwareRequests: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants dietary requirement is required" })
  @ApplicationMapped({ hasOther: true })
  dietaryRequirements: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicants T-Shirt size is required" })
  @ApplicationMapped()
  tShirtSize: string;

  @Column("varchar")
  @IsNotEmpty({ message: "The applicant hearAbout is required" })
  @ApplicationMapped({ hasOther: true })
  hearAbout: string;

  @Column("datetime", { nullable: true })
  @IsOptional()
  inviteAcceptDeadline: Date;

  // Applicant status, refers to the Enum ApplicationStatus
  @Column({
    type: "enum",
    enum: ApplicantStatus,
    default: ApplicantStatus.Applied
  })
  applicationStatus: ApplicantStatus;

  @Column("datetime", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
