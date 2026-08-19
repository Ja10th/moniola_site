-- ============================================================
-- TRIGGER FUNCTION: Auto-set grade on grade insert/update
-- ============================================================
CREATE OR REPLACE FUNCTION update_grade_trigger_fn()
RETURNS TRIGGER AS $$
DECLARE
  calculated_total NUMERIC(5,2);
  g VARCHAR;
  r VARCHAR;
BEGIN
  calculated_total := COALESCE(NEW.ca1, 0) + COALESCE(NEW.ca2, 0) + COALESCE(NEW.assignment, 0) + COALESCE(NEW.exam, 0);
  SELECT grade, remark INTO g, r FROM calculate_grade(calculated_total);
  NEW.grade := g;
  NEW.grade_remark := r;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_grade ON grades;
CREATE TRIGGER trg_update_grade
BEFORE INSERT OR UPDATE ON grades
FOR EACH ROW EXECUTE FUNCTION update_grade_trigger_fn();
