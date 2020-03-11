DROP FUNCTION  insertAttributeValue(integer,VARCHAR,VARCHAR);
CREATE OR REPLACE FUNCTION insertAttributeValue(org_unit_id integer,attribute_uid VARCHAR,attribute_value VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	attribute_value_id integer;
	results VARCHAR := 'success';
BEGIN
	BEGIN

		attribute_value_id = (SELECT MAX(attributevalueid) + 1 FROM attributevalue);

    INSERT INTO attributevalue(attributevalueid,created,lastupdated,value,attributeid) VALUES (attribute_value_id,now(),now(),attribute_value,(SELECT attributeid FROM attribute WHERE uid = attribute_uid));

    INSERT INTO organisationunitattributevalues(organisationunitid,attributevalueid) VALUES (org_unit_id,attribute_value_id);

		--results := 'success';


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

DROP FUNCTION  updateAttributeValue(integer,VARCHAR,VARCHAR);
CREATE OR REPLACE FUNCTION updateAttributeValue(org_unit_id integer,attribute_uid VARCHAR,attribute_value VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	results VARCHAR := 'success';
BEGIN
	BEGIN
		--results := 'success';
    UPDATE attributevalue SET value = attribute_value WHERE attributeid = (SELECT attributeid FROM attribute WHERE uid = attribute_uid) AND attributevalueid IN (SELECT attributevalueid FROM organisationunitattributevalues WHERE organisationunitid = org_unit_id);

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

DROP FUNCTION createWaterPoint(VARCHAR,VARCHAR,VARCHAR,VARCHAR,VARCHAR,VARCHAR,VARCHAR);
CREATE OR REPLACE FUNCTION createWaterPoint(water_point_name VARCHAR, code VARCHAR, parent VARCHAR,user_id VARCHAR,attributes VARCHAR,waterpoint_uid VARCHAR,orgunit_coordinates VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	parent_path character varying(255);
	parent_id integer;
	number_of_water_points integer;
	results VARCHAR;
	org_unit_uid character varying(11) := uid();
	org_unit_id integer;
	attr VARCHAR;
	dataSetUID VARCHAR := 'MTAVidYwh6V';
	programUID VARCHAR := 'lg2nRxyEtiH';
BEGIN
	BEGIN
    water_point_name = replace(replace(replace(replace(replace(replace(water_point_name,'-_comma_-',','),'-_bclose_-',')'),'-_bopen_-','('),'-_apost_-',','),'-_slash_-','/'),'-_dot_-','.');
    code = replace(code,'dot','.');
    attributes = replace(attributes,'-_slash_-','/');
		SELECT  organisationunit.organisationunitid,organisationunit.path INTO parent_id,parent_path FROM organisationunit WHERE uid = parent;
    CASE
      WHEN char_length(waterpoint_uid) <> 11 THEN
        SELECT  count(organisationunit.organisationunitid) INTO number_of_water_points FROM organisationunit WHERE parentid = parent_id;
        number_of_water_points = number_of_water_points + 1;
        --Insert the organisation units;
        INSERT INTO organisationunit (organisationunitid,uid,code,created,lastupdated,name,shortname,parentid,path,userid,openingdate,coordinates) VALUES((SELECT MAX(organisationunitid) + 1 FROM organisationunit),org_unit_uid,code,now(),now(),water_point_name,water_point_name,parent_id,parent_path||'/'||org_unit_uid,(SELECT userinfoid FROM userinfo WHERE uid = user_id),'2000-01-01','[' || replace(replace(orgunit_coordinates,'dot','.'),'comma',',') || ']');

        SELECT  organisationunit.organisationunitid INTO org_unit_id FROM organisationunit WHERE uid = org_unit_uid;
      WHEN  char_length(waterpoint_uid) = 11 THEN
        org_unit_uid = waterpoint_uid;
        SELECT organisationunitid INTO org_unit_id FROM organisationunit WHERE uid = waterpoint_uid;
        UPDATE organisationunit SET lastupdated = now(),name = water_point_name,shortname = water_point_name,parentid = parent_id,path = parent_path||'/'||org_unit_uid, coordinates = '[' || replace(replace(orgunit_coordinates,'dot','.'),'comma',',') || ']' WHERE uid = waterpoint_uid;
      ELSE

    END CASE;


    CASE
      WHEN char_length(waterpoint_uid) <> 11 THEN
        FOREACH attr IN array string_to_array(attributes, '-_') LOOP
             SELECT insertAttributeValue(org_unit_id,(string_to_array(attr,'_-'))[1],(string_to_array(attr,'_-'))[2]) INTO results;
        END LOOP;

            -- Assigning to program
        INSERT INTO program_organisationunits (programid, organisationunitid)VALUES ((SELECT programid FROM program WHERE uid = programUID),org_unit_id);
      WHEN char_length(waterpoint_uid) = 11 THEN
        FOREACH attr IN array string_to_array(attributes, '-_') LOOP
          SELECT updateAttributeValue(org_unit_id,(string_to_array(attr,'_-'))[1],(string_to_array(attr,'_-'))[2]) INTO results;
        END LOOP;
      ELSE

    END CASE;
    --creating the attribute values;
    --TODO here is where the loop to go through all the attribute goes;

		results := org_unit_uid;


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
--SELECT createWaterPoint('New Organisation Unit','DIiS6nXfTtQ','BZB2SLt3ylj','COWSO');

-- SELECT createWaterPoint('Ilela S-_slash_-secondary','dmGCj0znd9t','dmGCj0znd9t','vHgnIA6Wcc5_-Central Water basin-_FzlzchJ2J7S_-Rope pump-_DiZmTklKgmq_--_iLKwCl3Od9c_--_YtHLfazAtC1_--_ktuyhosn1zt_-Hand DTW-_rqlTarZRu8L_-Kiosk-_MMhip91li8h_--_jdVL0UuPB5h_-Water Board-_koixPT9d3Sr_-1919','u1NqAksqls5','-6dot369comma34dot8888');

-- PGPASSWORD=dhis psql -U dhis -h localhost -d water_test -a -f saving_water_points.sql
-- PGPASSWORD=postgres psql -U postgres -h localhost -d waterpoint -a -f src/sql/saving_water_points.sql

--SELECT createWaterPoint(
--'New',
--'02dot06dot01BNA35',
--'BANGA294852',
--'BZB2SLt3ylj',
--'vHgnIA6Wcc5_-Internal Drainage-_jdVL0UuPB5h_-Company-_FzlzchJ2J7S_-Afridev-_DiZmTklKgmq_-234234-_iLKwCl3Od9c_-Project%201-_YtHLfazAtC1_-Project%201-_ktuyhosn1zt_-Dam-_rqlTarZRu8L_-Bucket-_MMhip91li8h_-200-_koixPT9d3Sr_-2018',
--'new',
--'-6dot3690comma34dot8888');

SELECT 'DROP FUNCTION ' || oid::regprocedure || ';'
FROM   pg_proc
WHERE  proname = 'createwaterpoint'  -- name without schema-qualification
AND    pg_function_is_visible(oid);


