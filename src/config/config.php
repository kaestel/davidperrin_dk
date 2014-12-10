<?php

/**
* This file contains definitions
*
* @package Config
*/
error_reporting(E_ALL);

/**
* Site name
*/
define("SITE_UID", "DPD");
define("SITE_NAME", "davidperrin.dk");
define("SITE_DB", "davidperrin");
define("SITE_URL", $_SERVER["SERVER_NAME"]);
define("ADMIN_FRONT", "/sites/navigation.php");

define("DEFAULT_LANGUAGE_ISO", "EN"); // Regional language Danish
define("DEFAULT_COUNTRY_ISO", "DK"); // Regional country Denmark

include_once($_SERVER["FRAMEWORK_PATH"]."/config/file_paths.php");
include_once("config/databases.php");
include_once("config/connect.php");

?>
