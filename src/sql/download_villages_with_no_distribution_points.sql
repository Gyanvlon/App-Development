SELECT
  organisationunitlevel2.name "Region Name",
  organisationunitlevel3.name "LGA Name",
  organisationunitlevel4.name "Ward Name",
  organisationunitlevel5.name "Village Name"
FROM organisationunit organisationunitlevel5
  LEFT JOIN organisationunit organisationunitlevel4 ON organisationunitlevel5.parentid = organisationunitlevel4.organisationunitid
  LEFT JOIN organisationunit organisationunitlevel3 ON organisationunitlevel4.parentid = organisationunitlevel3.organisationunitid
  LEFT JOIN organisationunit organisationunitlevel2 ON organisationunitlevel3.parentid = organisationunitlevel2.organisationunitid
WHERE 0 = (SELECT count(*) FROM organisationunit waterpoint where hierarchylevel = 6 AND waterpoint.parentid = organisationunitlevel5.organisationunitid)
  AND organisationunitlevel5.hierarchylevel = 5 AND organisationunitlevel5.path like '%${orgunitid}%'
ORDER BY
  "Region Name",
  "LGA Name",
  "Ward Name",
  "Village Name";
