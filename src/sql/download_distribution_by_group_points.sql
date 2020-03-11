SELECT
        ou.uid,
	level2.name "Region Name",
	level3.name "LGA Name",
	level4.name "Ward Name",
	level5.name "Village Name",
	ou.name "Distribution Point Name",
	ou.code "Code",
	replace(split_part(ou.coordinates,',',1),'[','') "Latitude",
	replace(split_part(ou.coordinates,',',2),']','')  "Longitude",
	basin.value "Basin",
	water_point_management.value "Distribution Point Management",
	extraction_system.value "Extraction System",
	old_code.value "Old code",
	project.value "Project",
	project_name.value "Project Name",
	source_type.value "Source",
	technology.value "Technology",
	village_population.value "Village Population",
	year_of_construction.value "Year of construction",
        functionality_status.value "Functionality Status",
	non_functionality_status.value "Reasons for Non functional",
	population_served_by_water_point.value "Population served by Distribution Point",
	functional_taps.value "Functional Water Points",
	non_functional_taps.value "Not-Functional Water Points",
	availability_area_mechanic.value "Availability of Area Mechanic",
	availability_spare_parts.value "Availability of Spare Parts",
	expenditure_per_week.value "Expenditure Per Week (TSH)",
	fuel_expenditure.value "Fuel Expenditure",
	private_connections.value "Number of Private Connections",
	water_meters.value "Number of Water Meters",
	tariff_colection_per_week.value "Tariff Collection Per Week (TSH)",
	water_demand.value "Water Demand",
	price_private_con.value "Water Price for Private Connection",
	price_public_con.value "Water Price for Public WPS",


	water_quality.value "Water Quality",
	water_quantity.value "Water Quantity"
FROM organisationunit ou
INNER JOIN orgunitgroupmembers ougm ON(ougm.organisationunitid = ou.organisationunitid)
INNER JOIN orgunitgroup oug ON(ougm.orgunitgroupid = oug.orgunitgroupid AND oug.uid IN (SELECT unnest(string_to_array('${oug}', '-'))))
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 20140)
) as basin on(basin.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 22928)
) as water_point_management on(water_point_management.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 43738)
) as extraction_system on(extraction_system.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 20851)
) as old_code on(old_code.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 596195)
) as project on(project.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 20139)
) as project_name on(project_name.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 22915)
) as source_type on(source_type.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 20176)
) as technology on(technology.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 22933)
) as village_population on(village_population.organisationunitid = ou.organisationunitid)
LEFT JOIN (
	SELECT organisationunitid,value FROM organisationunitattributevalues attribute
	INNER JOIN attributevalue basin on(attribute.attributevalueid = basin.attributevalueid AND basin.attributeid = 22907)
) as year_of_construction on(year_of_construction.organisationunitid = ou.organisationunitid)
LEFT JOIN programstageinstance progstginst on(ou.organisationunitid = progstginst.organisationunitid AND (progstginst.executiondate = '${date}' OR progstginst.executiondate IS NULL))
LEFT JOIN _orgunitstructure orgstruct on(orgstruct.organisationunitid = ou.organisationunitid)
LEFT JOIN organisationunit level2 on level2.uid=orgstruct.uidlevel2
LEFT JOIN organisationunit level3 on level3.uid=orgstruct.uidlevel3
LEFT JOIN organisationunit level4 on level4.uid=orgstruct.uidlevel4
LEFT JOIN organisationunit level5 on level5.uid=orgstruct.uidlevel5
LEFT JOIN trackedentitydatavalue functionality_status ON (progstginst.programstageinstanceid=functionality_status.programstageinstanceid AND functionality_status.dataelementid=23720)
LEFT JOIN trackedentitydatavalue non_functionality_status ON (progstginst.programstageinstanceid=non_functionality_status.programstageinstanceid AND non_functionality_status.dataelementid=23721)
LEFT JOIN trackedentitydatavalue population_served_by_water_point ON (progstginst.programstageinstanceid=population_served_by_water_point.programstageinstanceid AND population_served_by_water_point.dataelementid=23722)
LEFT JOIN trackedentitydatavalue functional_taps ON (progstginst.programstageinstanceid=functional_taps.programstageinstanceid AND functional_taps.dataelementid=23723)
LEFT JOIN trackedentitydatavalue non_functional_taps ON (progstginst.programstageinstanceid=non_functional_taps.programstageinstanceid AND non_functional_taps.dataelementid=23724)

LEFT JOIN trackedentitydatavalue availability_area_mechanic ON (progstginst.programstageinstanceid=availability_area_mechanic.programstageinstanceid AND availability_area_mechanic.dataelementid=22953)
LEFT JOIN trackedentitydatavalue availability_spare_parts ON (progstginst.programstageinstanceid=availability_spare_parts.programstageinstanceid AND availability_spare_parts.dataelementid=22954)
LEFT JOIN trackedentitydatavalue expenditure_per_week ON (progstginst.programstageinstanceid=expenditure_per_week.programstageinstanceid AND expenditure_per_week.dataelementid=22957)
LEFT JOIN trackedentitydatavalue fuel_expenditure ON (progstginst.programstageinstanceid=fuel_expenditure.programstageinstanceid AND fuel_expenditure.dataelementid=22946)
LEFT JOIN trackedentitydatavalue private_connections ON (progstginst.programstageinstanceid=private_connections.programstageinstanceid AND private_connections.dataelementid=22942)
LEFT JOIN trackedentitydatavalue water_meters ON (progstginst.programstageinstanceid=water_meters.programstageinstanceid AND water_meters.dataelementid=22941)
LEFT JOIN trackedentitydatavalue tariff_colection_per_week ON (progstginst.programstageinstanceid=tariff_colection_per_week.programstageinstanceid AND tariff_colection_per_week.dataelementid=22956)
LEFT JOIN trackedentitydatavalue water_demand ON (progstginst.programstageinstanceid=water_demand.programstageinstanceid AND water_demand.dataelementid=22945)
LEFT JOIN trackedentitydatavalue price_private_con ON (progstginst.programstageinstanceid=price_private_con.programstageinstanceid AND price_private_con.dataelementid=22944)
LEFT JOIN trackedentitydatavalue price_public_con ON (progstginst.programstageinstanceid=price_public_con.programstageinstanceid AND price_public_con.dataelementid=22943)
LEFT JOIN trackedentitydatavalue water_quality ON (progstginst.programstageinstanceid=water_quality.programstageinstanceid AND water_quality.dataelementid=22940)
LEFT JOIN trackedentitydatavalue water_quantity ON (progstginst.programstageinstanceid=water_quantity.programstageinstanceid AND water_quantity.dataelementid=801172)
WHERE ou.hierarchylevel = 6 AND ou.path like '%${ou}%'
ORDER BY level2.name,level3.name,level4.name,level5.name,ou.name;

