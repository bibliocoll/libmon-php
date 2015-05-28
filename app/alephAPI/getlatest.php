<?php
// Initially based on: http://www.exlibrisgroup.org/display/AlephCC/Aleph+RSS+feeds+%28PHP+script%29
// Original code by Thomas McNulty 2010, Virginia Commonwealth University
// f. Aleph/MPG Daniel Zimmel 2011-2014
// RSS related code removed by Alex Krug (krug@coll.mpg.de) 2015
// License: BSD style
// Short description: Use, modification and distribution of the code are permitted provided
// the copyright notice, list of conditions and disclaimer appear in all related material.
//
// you need X-server permissions

require_once('Cache/Lite.php');

function is_valid_callback($subject)
{
    $identifier_syntax
        = '/^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\x{200C}\x{200D}]*+$/u';

    $reserved_words = array('break', 'do', 'instanceof', 'typeof', 'case',
        'else', 'new', 'var', 'catch', 'finally', 'return', 'void', 'continue',
        'for', 'switch', 'while', 'debugger', 'function', 'this', 'with',
        'default', 'if', 'throw', 'delete', 'in', 'try', 'class', 'enum',
        'extends', 'super', 'const', 'export', 'import', 'implements', 'let',
        'private', 'public', 'yield', 'interface', 'package', 'protected',
        'static', 'null', 'true', 'false');

    return preg_match($identifier_syntax, $subject)
        && ! in_array(mb_strtolower($subject, 'UTF-8'), $reserved_words);
}


//process input and abort on error
$myquery = htmlspecialchars($_GET['query']);
if (empty($myquery)) {
    header('status: 400 Bad Request', true, 400);
    exit("missing query, exiting");
}

$mycallback = htmlspecialchars($_GET['callback']);
if (empty($mycallback) or !is_valid_callback($mycallback)) {
    header('status: 400 Bad Request', true, 400);
    exit("missing or malformed callback, exiting");
}


// Aleph Base
$base = "rdg01";

$cache_id = $myquery;

$cache_options = array(
    'cacheDir' => '/tmp/',
    'lifeTime' => 36 //in Seconds
);

$Cache_Lite = new Cache_Lite($cache_options);

if ($jsondata = $Cache_Lite->get($cache_id)) {
    //header("X-Cache-Hit: true");
} else {
    //header("X-Cache-Hit: false");
    $return_array = array();
    $bibname = "MPI for Research on Collective Goods";

	//EDIT ME!
    //Change library_url to match the base url of your catalog
    $library_url = "http://aleph.mpg.de";
    $vufind_base = "http://core.coll.mpg.de";
	//END EDIT ME!

	// Define local Aleph query fields to select the publications you want to present, e.g.:
	// 'YYMM' for month of acquisition
	// 'R' for institute publications
	// 'featuredbook' for new books
	// 'E' for new e-books

    // Change as needed to match your catalog X-server location - please consult the X-services documentation
    // for help in setting up the X-server
    $base_url = $library_url."/X?op=find&base=".$base;

    //Sort variables
    $sort_url = $library_url."/X?op=sort-set&library=".$base;

    // In order to sort, sort codes must be used from the Aleph // xxx01/tab/tab_sort table which uses
    // the filing procedure defined at xxx01/tab/tab_filing
    // Please consult the files above for help in setting this up
    // Prerequisite for sorting by date: add the following entry to *all* in tab_sort
	// 11 99 003#1         002#1                                                   00 00
	// (after editing tab_sort you must run p-manage-27)
    $sort_code = "&sort_code_1=11&sort_order_1=D&sort_code_2=03&sort_order_2=D"; // sorts by MAB 003/002

    //Present variables
    $display_url = $library_url."/X?op=present&base=".$base;
    $set_entry = "&set_entry=001-";

    //change to the url of your library's X server
    $library_xurl= $library_url."/X";

	// define queries, which are needed (e.g.) for PHP-logic (e.g. find out recent month)
    $mydaterequest = date('ym')."+OR+".date('ym',strtotime("-1 Months"));
    if ($myquery == "new-acq") {
        $request_url = $library_xurl."?op=find&base=".$base."&request=(WAB=".$mydaterequest.")";
    } elseif ($myquery == "newpublications") {
        $mydaterequest = $mydaterequest."+OR+".date('ym',strtotime("-2 Months"));
        $request_url = $library_xurl."?op=find&base=".$base."&request=(WAB=".$mydaterequest."%20AND%20wkm=R)";
    } elseif ($myquery == "newfeaturedbooks") {
        $request_url = $library_xurl."?op=find&base=".$base."&request=(WAB=".$mydaterequest."%20AND%20wab=featuredbook)";
    } elseif ($myquery == "new-e-books") {
        $request_url = $library_xurl."?op=find&base=".$base."&request=(WAB=".$mydaterequest."%20AND%20wkm=E)";
    } else {
        //$request_url = $library_xurl."?op=find&base=".$base."&request=(".$myquery.")";
        header('status: 451 Unavailable For Legal Reasons', true, 400);
        exit("Query string outside allowed values");
    }

    // The line below launches the first step in the X-services process - it's asking the server for a set of results
    // based on the URL entered above in the request_url variable - the server responds with a set number and number of records that
    // are captured in variables below
    $result = simplexml_load_file($request_url);
    $set_number = $result->set_number;
    $record_count = $result->no_records;

    if (empty($record_count)) {
        header('status: 204 No Content', true, 204);
        exit("No Data from Aleph");
}

    // The line below then takes the set number and sorts the results - sorting is more complicated to configure if you're
    // need to sort on a field that is not already sortable in your catalog - consult Sort Set X-Service in the Aleph
    // X-Services guide and the tab_sort and tab_filing files in your XXX01 library for more information
    simplexml_load_file($sort_url."&set_number=".$set_number.$sort_code);

    // The line below is the final request sent from this script to the X-server
    // This grabs the sorted set and presents them in XML
    $result = simplexml_load_file($display_url.$set_entry.$record_count."&set_number=".$set_number);

    // in the foreach loop below you can change the xpath queries to more closely match the cataloging at your library
    // for example you can change the 245 subfield b to c if you'd rather have the author listed instead of the subtitle
    // (if that's how items are cataloged at your library - consult your local cataloger if you want to find out more)
    foreach ($result as $record){
        // check item process status (Z30$$p), e.g. 'SV' (sent to vendor) or 'GG' (in process) or 'NP' (not yet published) (expand_doc_bib_z30 has to be set in tab_expand f. WWW-X)
        $gg = $record->xpath("metadata/oai_marc/varfield[@id='Z30']/subfield[@label='p']");
        if (empty($gg)) { // continue only when item process status = '' (empty) (= holdings)
            $record_array = array();

            $doc_number_result = $record->xpath("doc_number");
            $doc_number = $doc_number_result[0];
            $author_result = $record->xpath("metadata/oai_marc/varfield[@id='100']/subfield[@label='a']");
            $author = (empty($author_result[0]) ? '' :  preg_replace("/[<>]/","",$author_result[0]));
            $author2_result = $record->xpath("metadata/oai_marc/varfield[@id='104']/subfield[@label='a']");
            $author2 = (empty($author2_result[0]) ? '' :  preg_replace("/[<>]/","",$author2_result[0]));
            $author3_result = $record->xpath("metadata/oai_marc/varfield[@id='108']/subfield[@label='a']");
            $author3 = (empty($author3_result[0]) ? '' :  preg_replace("/[<>]/","",$author3_result[0]));
            // Title volume:
            $title_result = $record->xpath("metadata/oai_marc/varfield[@id='331' and @i2='1']/subfield[@label='a']");
            $subtitle_result = $record->xpath("metadata/oai_marc/varfield[@id='335']/subfield[@label='a']");
            // Title of superior record:
            $title_mbw_result = $record->xpath("metadata/oai_marc/varfield[@id='331' and @i2='2']/subfield[@label='a']");
            $volume = $record->xpath("metadata/oai_marc/varfield[@id='089']/subfield[@label='a']");
            // Title construction:
            $title = trim((empty($title_result[0]) ? '' : rtrim((string)preg_replace("/[<>]/","",$title_result[0]),"/")) . (empty($subtitle_result[0]) ? '' :  ": ".rtrim((string)$subtitle_result[0],"/")));
            $title .= (empty($title_mbw_result[0]) ? '' : " (".rtrim((string)preg_replace("/[<>]/","",$title_mbw_result[0]),"/"));
            $title .= (empty($volume[0]) ? '' :  ": ".rtrim((string)$volume[0],"/").") ");

            $callnumber_result = $record->xpath("metadata/oai_marc/varfield[@id='LOC']/subfield[@label='d']");
            $publisher = $record->xpath("metadata/oai_marc/varfield[@id='410']/subfield[@label='a']");
            $year = $record->xpath("metadata/oai_marc/varfield[@id='425']/subfield[@label='a']");
            $notation_result = $record->xpath("metadata/oai_marc/varfield[@id='700']/subfield[@label='a']");
            // display up to 3 notations:
            $notation = (empty($notation_result[0]) ? '' :  $notation_result[0]).(empty($notation_result[1]) ? '' : ", ". $notation_result[1]).(empty($notation_result[2]) ? '' : ", ".$notation_result[2]);
            // grab summary:
            $abstract = $record->xpath("metadata/oai_marc/varfield[@id='750']/subfield[@label='a']");
            // construct description:
            $description = (empty($publisher[0]) ? '' : $publisher[0]." ").(empty($year[0]) ? '' : $year[0].". ").(empty($callnumber_result[0]) ? '' : " Call No.:&nbsp;".(string)$callnumber_result[0]);
            $description .= (empty($notation) ? '' : ". Notation: ". $notation.".");
            $description .= (empty($abstract[0]) ? '' : "- Abstract: ". $abstract[0]);
            // component part: construct source
            $mab590_result = $record->xpath("metadata/oai_marc/varfield[@id='590']/subfield[@label='a']");
            $mab595_result = $record->xpath("metadata/oai_marc/varfield[@id='595']/subfield[@label='a']");
            $mab596_result = $record->xpath("metadata/oai_marc/varfield[@id='596']/subfield[@label='a']");
            $aleph_source = (empty($mab590_result[0]) ? '' :  preg_replace("/[<>]/","",trim($mab590_result[0])));
            $aleph_source .= (empty($mab596_result[0]) ? '' :  ' ('.preg_replace("/[<>]/","",trim($mab596_result[0])).')');
            $aleph_source .= (empty($mab595_result[0]) ? '' :  ' '. trim($mab595_result[0]));
			// select [1] in the following queries, because the aleph output
			// always uses the first field for the first level of hierarchy
			// (default, if omitted: uses last found field, which could be the parent level field!)
            $pubDate_result = $record->xpath("metadata/oai_marc/varfield[@id='003'][1]/subfield[@label='a']");
            $pubDate_result_2 = $record->xpath("metadata/oai_marc/varfield[@id='002'][1]/subfield[@label='a']");
            $pubDateA = trim((empty($pubDate_result[0]) ? $pubDate_result_2[0] : rtrim((string)$pubDate_result[0]))); // get/trim date
            $pubDate = date("D, d M Y H:i:s T",strtotime($pubDateA)); // format date
            // save ISBN to guid field
            $guid_result = $record->xpath("metadata/oai_marc/varfield[@id='540']/subfield[@label='a']");
            $guid = (empty($guid_result[0]) ? '' : trim($guid_result[0]));

            // add record to return_array
            if (!empty($title)) {
                $vufind_url = $vufind_base . "/Record/" . strtoupper($base) . str_pad($doc_number, 21, "0", STR_PAD_LEFT);

                $record_array['title'] = $title;
                $record_array['link'] = $vufind_url;
                $record_array['description'] = $description;
                $record_array['pubDate'] = $pubDate;
                (!empty($guid))? $record_array['guid'] = $guid : '';
                (!empty($aleph_source))? $record_array['aleph_source'] = $aleph_source : '';
                $record_array['authors'] = array();
                $record_array['authors']['author'] = $author;
                (!empty($author2))? $record_array['authors']['author2'] = $author2 : '';
                (!empty($author3))? $record_array['authors']['author3'] = $author3 : '';

                $return_array[] = $record_array;
            }
        }
        $jsondata = utf8_encode(json_encode($return_array));
        $Cache_Lite->save($jsondata);
    }
}

//return json
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
print $_GET['callback'] . "(" . $jsondata .")";
?>

