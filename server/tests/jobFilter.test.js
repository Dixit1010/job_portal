import { buildJobFilter } from "../services/job.service.js";

describe("buildJobFilter", () => {
  it("combines location and salary into separate $and clauses instead of overwriting each other", () => {
    const filter = buildJobFilter({ location: "Mumbai", salary: "50000" });

    expect(filter.$or).toBeUndefined();
    expect(filter.$and).toHaveLength(2);

    const [locationClause, salaryClause] = filter.$and;
    expect(locationClause.$or).toEqual(
      expect.arrayContaining([{ location: { $regex: "Mumbai", $options: "i" } }])
    );
    expect(salaryClause.$or).toEqual(
      expect.arrayContaining([{ fixedSalary: { $gte: 50000 } }])
    );
  });

  it("applies only a location filter when salary is absent", () => {
    const filter = buildJobFilter({ location: "Delhi" });
    expect(filter.$and).toHaveLength(1);
    expect(filter.$and[0].$or).toEqual(
      expect.arrayContaining([{ location: { $regex: "Delhi", $options: "i" } }])
    );
  });

  it("omits $and entirely when neither location nor salary is provided", () => {
    const filter = buildJobFilter({ keyword: "engineer" });
    expect(filter.$and).toBeUndefined();
    expect(filter.title).toEqual({ $regex: "engineer", $options: "i" });
  });
});
