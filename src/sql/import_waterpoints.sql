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
    FROM '/home/vincent/uploads/Batch10.csv' WITH CSV HEADER DELIMITER ',';
    DELETE FROM trackedentitydatavalue WHERE programstageinstanceid IN (SELECT programstageinstanceid FROM programstageinstance WHERE organisationunitid IN (SELECT organisationunitid FROM tempwaterpoint INNER JOIN organisationunit USING(uid)));
    DELETE FROM programstageinstance WHERE organisationunitid IN (SELECT organisationunitid FROM tempwaterpoint  INNER JOIN organisationunit USING(uid));
    FOR waterpointdata IN SELECT * FROM tempwaterpoint LOOP
      BEGIN
        SELECT * INTO orgunitdata FROM organisationunit WHERE uid = waterpointdata.UID;
        UPDATE organisationunit SET coordinates = '[' || waterpointdata.LATITUDE || ',' || waterpointdata.LONGITUDE || ']' WHERE organisationunit.organisationunitid = orgunitdata.organisationunitid;
        --INSERT INTO public.datasetsource(
        --            datasetid, sourceid)
        --    SELECT (SELECT datasetid FROM dataset WHERE uid = 'MTAVidYwh6V'), orgunitdata.organisationunitid
        --    WHERE NOT EXISTS (SELECT * FROM datasetsource WHERE datasetid = (SELECT datasetid FROM dataset WHERE uid = 'MTAVidYwh6V')
        --    AND sourceid = orgunitdata.organisationunitid);
            --VALUES ((SELECT datasetid FROM dataset WHERE uid = 'MTAVidYwh6V'), orgunitdata.organisationunitid);
        INSERT INTO public.program_organisationunits(
                    organisationunitid, programid)
            SELECT orgunitdata.organisationunitid, (SELECT programid FROM program WHERE uid = 'lg2nRxyEtiH')
            WHERE NOT EXISTS (SELECT * FROM program_organisationunits WHERE organisationunitid = orgunitdata.organisationunitid
            AND programid = (SELECT programid FROM program WHERE uid = 'lg2nRxyEtiH'));
            --VALUES (orgunitdata.organisationunitid, (SELECT programid FROM program WHERE uid = 'lg2nRxyEtiH'));
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'DiZmTklKgmq'::varchar,waterpointdata.WPCODE) INTO results;
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'koixPT9d3Sr'::varchar,waterpointdata.YEAROFCONSTRUCTION) INTO results;
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'vHgnIA6Wcc5'::varchar,waterpointdata.BASIN) INTO results;
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'rqlTarZRu8L'::varchar,waterpointdata.TECHNOLOGY) INTO results;
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'FzlzchJ2J7S'::varchar,waterpointdata.EXTRACTIONSYSTEM) INTO results;
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'ktuyhosn1zt'::varchar,waterpointdata.SOURCE) INTO results;
        SELECT insertAttributeValue(orgunitdata.organisationunitid,'jdVL0UuPB5h'::varchar,waterpointdata.WPMANAGEMENT) INTO results;

        -- Creating event
        IF (SELECT count(*) FROM programstageinstance WHERE organisationunitid = orgunitdata.organisationunitid) > 0 THEN
          SELECT programstageinstanceid INTO event_id FROM programstageinstance WHERE organisationunitid = orgunitdata.organisationunitid;
        ELSE
          SELECT MAX(programstageinstanceid) + 1 INTO event_id FROM programstageinstance;
              IF event_id IS NULL THEN
                 event_id = 1;
              END IF;
              INSERT INTO programstageinstance (programstageinstanceid,uid,created,lastupdated,programinstanceid,programstageid,attributeoptioncomboid,
              storedby,duedate,executiondate,organisationunitid,status,latitude,longitude,completedby,completeddate,deleted)
              VALUES(event_id,uid(),now(),now(),23719,23718,15,'vincentminde',
                (select to_timestamp('2018-05-01', 'YYYY-MM-DD')::timestamp without time zone),(select to_timestamp('2018-05-01', 'YYYY-MM-DD')::timestamp without time zone),
                orgunitdata.organisationunitid,'COMPLETED',(select cast(waterpointdata.LATITUDE as double precision)),(select cast(waterpointdata.LONGITUDE as double precision)),
                'vincentminde',(select to_timestamp('2018-05-01', 'YYYY-MM-DD')::timestamp without time zone),FALSE);
        END IF;

        FOR datavaluedata IN SELECT * FROM
        (values
          ('syCVdYbi97J',waterpointdata.WPSTATUS),
          ('V11RbBMzvBF',waterpointdata.FUNCTIONALTAPS),
          ('hybUxFbrf2x',waterpointdata.NONFUNCTUNTIONALTAPS),
          ('bxyIdtaXDnV',waterpointdata.BASIN),
          ('pPokJR4t9oB',orgunitdata.code),
          ('mG4h6H9hkCR',waterpointdata.TECHNOLOGY),
          ('JfdxnxtF35Z',waterpointdata.SOURCE),
          ('cYYk3DwYX2w',waterpointdata.WPMANAGEMENT),
          ('uMVfhX9nFp7',waterpointdata.WPNAME),
          ('k4kgajFBfot',waterpointdata.YEAROFCONSTRUCTION),
          ('EwnpnDf4dRp',waterpointdata.WPCODE),
          ('K0FIKK5Ks05',waterpointdata.WATERQUALITY),
          ('Tu1rAp10A4N',waterpointdata.EXTRACTIONSYSTEM),
          ('gzOsYyfND6e',waterpointdata.WATERQUANTITY)
        ) as data(uid,value)
        LOOP
          IF (SELECT count(*) FROM trackedentitydatavalue WHERE programstageinstanceid = event_id AND dataelementid = (SELECT dataelementid FROM dataelement WHERE uid = datavaluedata.uid)) > 0 THEN
                UPDATE trackedentitydatavalue SET value = datavaluedata.value WHERE programstageinstanceid = event_id AND dataelementid = (SELECT dataelementid FROM dataelement WHERE uid = datavaluedata.uid);
          ELSE
            INSERT INTO public.trackedentitydatavalue(
                                   programstageinstanceid, dataelementid, value, created, lastupdated,
                                   providedelsewhere, storedby)
                       VALUES (event_id,(SELECT dataelementid FROM dataelement WHERE uid = datavaluedata.uid), datavaluedata.value, now(), now(),
                                   FALSE, 'vincentminde');
          END IF;
        END LOOP;
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
--PGPASSWORD=dhis psql -U dhis -h localhost -d dhis_tz_waterpointtraining -a -f import_waterpoints.sql
--PGPASSWORD=dhis psql -U dhis -h localhost -d water_test -a -f import_waterpoints.sql
--nodejs completeness.js http://localhost:8085 vincentminde:StrongPasswordABC123 201710 2017-10-01
SELECT createWaterPoints();
