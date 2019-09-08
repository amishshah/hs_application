import test from "ava";
import * as request from "supertest";
import { App } from "../../src/app";
import { Express } from "express";
import { initEnv, getTestDatabaseOptions } from "../util/testUtils";
import { HttpResponseCode } from "../../src/util/errorHandling";
import container from "../../src/inversify.config";
import { Applicant } from "../../src/models/db";

let bApp: Express;
const newApplicantRequest: any = {
  applicantName: "test",
  applicantAge: 20,
  applicantGender: "Other",
  applicantGenderOther: "Test",
  applicantNationality: "UK",
  applicantCountry: "UK",
  applicantCity: "Manchester",
  applicantUniversity: "UoM",
  applicantSkills: "",
  applicantWhyChoose: "",
  applicantPastProj: "",
  applicantHardwareReq: "",
  applicantStudyYear: "Foundation",
  applicantWorkArea: "Other",
  applicantWorkAreaOther: "This",
  applicantHackathonCount: 0,
  applicantDietaryRequirements: "Test",
  applicantTShirt: "M"
};
const testApplicant: Applicant = {
  id: undefined,
  name: "test",
  age: 20,
  gender: "Test",
  nationality: "UK",
  country: "UK",
  city: "Manchester",
  university: "UoM",
  skills: "",
  whyChooseHacker: "",
  pastProjects: "",
  hardwareRequests: "",
  yearOfStudy: "Foundation",
  workArea: "This",
  hackathonCount: 0,
  dietaryRequirements: "Test",
  tShirtSize: "M"
};

test.before.cb(t => {
  initEnv();

  new App().buildApp(async (builtApp: Express, err: Error): Promise<void> => {
    if (err) {
      throw Error("Failed to setup test");
    } else {
      bApp = builtApp;
      t.end();
    }
  }, getTestDatabaseOptions());
});

test.beforeEach(t => {
  // Create a snapshot so each unit test can modify it without breaking other unit tests
  container.snapshot();
});

test.afterEach(t => {
  // Restore to last snapshot so each unit test takes a clean copy of the application container
  container.restore();
});

test("Test 404 page provided when invalid URL", async t => {
  // Perform the request along .../apply
  const response = await request(bApp)
    .get("/invalidpage-url-123");

  // Check that we get a OK (200) response code
  t.is(response.status, HttpResponseCode.OK);
});

test("Test applicant created with valid request", async t => {
  // Perform the request along .../apply
  const response = await request(bApp)
    .post("/apply")
    .send(newApplicantRequest);

  // Check that we get a OK (200) response code
  t.is(response.status, HttpResponseCode.OK);
  t.truthy(response.body.id);
  testApplicant.id = response.body.id;
  t.deepEqual(response.body, testApplicant);
});