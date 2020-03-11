UPDATE programstageinstance SET executiondate = date_trunc('month', now()) - interval '1 month' WHERE executiondate = date_trunc('month', now()) - interval '2 month';
INSERT INTO period VALUES((SELECT max(periodid) + 1 FROM period),(SELECT periodtypeid FROM periodtype WHERE name ='Monthly'),date_trunc('month', now()) - interval '1 month',date_trunc('month',now()) - '1 day'::interval);
UPDATE completedatasetregistration SET periodid=(SELECT periodid FROM period WHERE startdate =date_trunc('month', now()) - interval '1 month' AND enddate=(date_trunc('month',now()) - interval '1 day'));

--PGPASSWORD=dhis psql -U dhis -h localhost -d water_test -a -f moveperiod.sql
