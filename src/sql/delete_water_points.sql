DROP FUNCTION deleteWaterPoint(VARCHAR);
CREATE OR REPLACE FUNCTION deleteWaterPoint(waterpoint_uid VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	results VARCHAR;
BEGIN
	BEGIN
	  DELETE FROM organisationunitattributevalues WHERE organisationunitid = (SELECT organisationunitid FROM organisationunit WHERE uid =waterpoint_uid);
    DELETE FROM program_organisationunits WHERE organisationunitid = (SELECT organisationunitid FROM organisationunit WHERE uid =waterpoint_uid);
    DELETE FROM trackedentitydatavalue WHERE programstageinstanceid IN (SELECT programstageinstanceid FROM programstageinstance WHERE organisationunitid = (SELECT organisationunitid FROM organisationunit WHERE uid =waterpoint_uid));
    DELETE FROM trackedentitydatavalueaudit WHERE programstageinstanceid IN (SELECT programstageinstanceid FROM programstageinstance WHERE organisationunitid = (SELECT organisationunitid FROM organisationunit WHERE uid =waterpoint_uid));
    DELETE FROM programstageinstance WHERE organisationunitid = (SELECT organisationunitid FROM organisationunit WHERE uid =waterpoint_uid);
    DELETE FROM organisationunit WHERE uid =waterpoint_uid;
    --creating the attribute values;
    --TODO here is where the loop to go through all the attribute goes;

		results := 'Success';


	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		CASE
      WHEN SQLERRM = 'duplicate key value violates unique constraint "organisationunit_code_key"' THEN
        results := 'Duplicate code. Failed to generated code since it already exists.';
      ELSE
        raise notice '% %', SQLERRM, SQLSTATE;
        results := SQLERRM;
      END CASE;
	END;

	RETURN results;

END;
$$
LANGUAGE plpgsql;
/*
 call delete function by pass orgunit id  text, text, text,MMhip91li8h text,iLKwCl3Od9c text,rqlTarZRu8L text,koixPT9d3Sr text,FzlzchJ2J7S
*/
--SELECT deleteWaterPoint('xEiQLAvxN24');

--SELECT createWaterPoint('Ilela S-_slash_-secondary','HZ38U11anfs','HZ38U11anfs','vHgnIA6Wcc5_-Central Water basin-_FzlzchJ2J7S_-Rope pump-_DiZmTklKgmq_--_iLKwCl3Od9c_--_YtHLfazAtC1_--_ktuyhosn1zt_-Hand DTW-_rqlTarZRu8L_-Kiosk-_MMhip91li8h_--_jdVL0UuPB5h_-Water Board-_koixPT9d3Sr_-1919','u1NqAksqls5','-6dot369comma34dot8888');

-- PGPASSWORD=dhis psql -U dhis -h localhost -d water_test -a -f delete_water_points.sql
-- PGPASSWORD=postgres psql -U postgres -h localhost -d water -a -f src/sql/delete_water_points.sql


