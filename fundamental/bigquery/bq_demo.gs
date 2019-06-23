// 先ほど控えたプロジェクト番号に置き換える
var projectNumber = 'XXXXXXXX'; 
var ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen() {
  var menuEntries = [ {name: 'Run Query', functionName: 'runQuery'} ];
  ss.addMenu('BigQuery', menuEntries);
}

function runQuery() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var sql = 'select TOP(word, 10), COUNT(*) as word_count from publicdata:samples.shakespeare WHERE LENGTH(word) > 12;';
  var queryResults;

  // Inserts a Query Job with an optional timeoutMs parameter.
  try {
    var resource = {query: sql, timeoutMs: 1000, userQueryCache: false};
    queryResults = BigQuery.Jobs.query(resource, projectNumber);
  }
  catch (err) {
    Logger.log(err);
    Browser.msgBox(err);
    return;
  }

  while (queryResults.getJobComplete() == false) {
    try {
      queryResults = BigQuery.Jobs.getQueryResults(projectNumber, queryResults.getJobReference().getJobId());
      // If the Job is still not complete, sleep script for
      // 3 seconds before checking result status again
      if (queryResults.getJobComplete() == false) {
        Utilities.sleep(3000);
      }
    }

    catch (err) {
      Logger.log(err);
      Browser.msgBox(err);
      return;
    }
  }

  // Update the amount of results
  var resultCount = queryResults.getTotalRows();
  var resultSchema = queryResults.getSchema();
  var resultValues = new Array(resultCount);
  var tableRows = queryResults.getRows();

  // Iterate through query results
  for (var i = 0; i < tableRows.length; i++) {
    var cols = tableRows[i].getF();
    resultValues[i] = new Array(cols.length);
    // For each column, add values to the result array
    for (var j = 0; j < cols.length; j++) {
      resultValues[i][j] = cols[j].getV();
    }
  }

  // Update the Spreadsheet with data from the resultValues array
  sheet.getRange(1, 1, resultCount, tableRows[0].getF().length).setValues(resultValues);
}

