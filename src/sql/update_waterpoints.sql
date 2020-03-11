DROP FUNCTION  insertAttributeValue(integer,VARCHAR,VARCHAR);
CREATE OR REPLACE FUNCTION insertAttributeValue(org_unit_id integer,attribute_uid VARCHAR,attribute_value VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	exist integer;
	attribute_value_id integer;
	results VARCHAR := 'success';
BEGIN
	BEGIN

    SELECT count(*) INTO exist FROM organisationunitattributevalues
    INNER JOIN attributevalue av using(attributevalueid)
    INNER JOIN attribute a using(attributeid)
    WHERE organisationunitid = org_unit_id AND a.uid = attribute_uid;

    CASE
      WHEN exist = 1 THEN
        UPDATE attributevalue SET value = attribute_value WHERE
        attributevalueid = (SELECT attributevalueid FROM organisationunitattributevalues
         INNER JOIN attributevalue av using(attributevalueid)
         INNER JOIN attribute using(attributeid)
         WHERE organisationunitid = org_unit_id AND attribute.uid = attribute_uid);
      ELSE
        attribute_value_id = (SELECT MAX(attributevalueid) + 1 FROM attributevalue);
        IF attribute_value_id IS NULL THEN
          attribute_value_id = 1;
        END IF;
        INSERT INTO attributevalue(attributevalueid,created,lastupdated,value,attributeid) VALUES (attribute_value_id,now(),now(),attribute_value,(SELECT attributeid FROM attribute WHERE uid = attribute_uid));
        INSERT INTO organisationunitattributevalues(organisationunitid,attributevalueid) VALUES (org_unit_id,attribute_value_id);
    END CASE;
		results := 'success';


	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		RAISE NOTICE 'context: >>%<<', _c;
		raise notice '% %', SQLERRM, SQLSTATE;
		results := CONCAT('Fail to insert  : ',_c);
	END;

	RETURN results;

END;
$$
LANGUAGE plpgsql;

DROP FUNCTION createWaterPoints();
CREATE OR REPLACE FUNCTION createWaterPoints() RETURNS VARCHAR AS $$
DECLARE
	_c text;
	waterpointdata record;
	orgunitdata record;
	datavaluedata record;
	event_id integer;
	results VARCHAR;
BEGIN
	BEGIN
	  DROP TABLE IF EXISTS tempwaterpoint;
	  CREATE TABLE tempwaterpoint(
	    REGION VARCHAR(200),
      DISTRICT VARCHAR(200),
      LGA VARCHAR(200),
      WARD VARCHAR(200),
      VILLAGE VARCHAR(200),
      SUBVILLAGE VARCHAR(200),
      UID VARCHAR(200) PRIMARY KEY,
      WPNAME VARCHAR(200),
      WPCODE VARCHAR(200),
      YEAROFCONSTRUCTION VARCHAR(200),
      LONGITUDE VARCHAR(200),
      LATITUDE VARCHAR(200),
      BASIN VARCHAR(200),
      WPSTATUS VARCHAR(200),
      TOTALTAPS VARCHAR(200),
      FUNCTIONALTAPS VARCHAR(200),
      NONFUNCTUNTIONALTAPS VARCHAR(200),
      TECHNOLOGY VARCHAR(200),
      EXTRACTIONSYSTEM VARCHAR(200),
      SOURCE VARCHAR(200),
      WPMANAGEMENT VARCHAR(200),
      WATERQUALITY VARCHAR(200),
      WATERQUANTITY VARCHAR(200),
      --CONCAT VARCHAR(200),
      --PATH VARCHAR(200),
      STATUS VARCHAR(20)
    );
    COPY tempwaterpoint(REGION,DISTRICT,LGA,WARD,VILLAGE,SUBVILLAGE,UID,WPNAME,WPCODE,YEAROFCONSTRUCTION,LONGITUDE,LATITUDE,BASIN,WPSTATUS,
    TOTALTAPS,FUNCTIONALTAPS,NONFUNCTUNTIONALTAPS,TECHNOLOGY,EXTRACTIONSYSTEM,SOURCE,WPMANAGEMENT,WATERQUALITY,WATERQUANTITY)
    FROM '/home/vincent/Batch10.csv' WITH CSV HEADER DELIMITER ',';

    FOR waterpointdata IN SELECT * FROM tempwaterpoint LOOP
      BEGIN
        SELECT * INTO orgunitdata FROM organisationunit WHERE uid = waterpointdata.UID;
        UPDATE organisationunit SET coordinates = '[' || waterpointdata.LATITUDE || ',' || waterpointdata.LONGITUDE || ']' WHERE organisationunit.organisationunitid = orgunitdata.organisationunitid;
      EXCEPTION WHEN OTHERS THEN
      		raise notice '% % %', orgunitdata.uid,waterpointdata.LATITUDE,waterpointdata.LONGITUDE;
      		UPDATE tempwaterpoint SET status = 'ERROR' WHERE uid = waterpointdata.UID;
      END;
     END LOOP;
    results = 'Success';
    copy (SELECT * FROM tempwaterpoint WHERE status = 'ERROR') to PROGRAM 'cat >>/tmp/result.csv';
	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		RAISE NOTICE 'context: >>%<<', _c;
		raise notice '% %', SQLERRM, SQLSTATE DETAIL;
		results := 'Error';
	END;

	RETURN results;

END;
$$
LANGUAGE plpgsql;

--DELETE FROM trackedentitydatavalue;
--DELETE FROM trackedentitydatavalueaudit;
--DELETE FROM programstageinstance;
--DELETE FROM trackedentityattributevalue;
--DELETE FROM trackedentityattributevalueaudit;
--DELETE FROM trackedentityinstance;
--DELETE FROM organisationunitattributevalues;
--DELETE FROM attributevalue;
--PGPASSWORD=postgres psql -U postgres -h localhost -d waterpoint -a -f src/sql/import_waterpoints.sql
--PGPASSWORD=dhis psql -U dhis -h localhost -d dhis_tz_waterpointtraining -a -f update_waterpoints.sql
--PGPASSWORD=dhis psql -U dhis -h localhost -d water_test -a -f import_waterpoints.sql
--nodejs completeness.js http://localhost:8085 vincentminde:StrongPasswordABC123 201710 2017-10-01
SELECT createWaterPoints();
