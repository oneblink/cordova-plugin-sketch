if(navigator.sketch != null && navigator.sketch != undefined){
  navigator.sketch.canvasHtml = '<div id="header" role="contentinfo"></div>'+
  '  <!-- These 3 canvases are displayed directly on top of each other.'+
  '          The exact height will be computed during inkInitialize().           -->'+
  '  <div id="canvasGroup" aria-label="Ink canvas" role="img" >'+
  '      <img id="canvasImg" width="0" height="0">'+
  '      <canvas id="HighlightCanvas" class="surface"></canvas>'+
  '      <canvas id="InkCanvas"       class="surface"></canvas>'+
  '      <canvas id="SelectCanvas"    class="surface"></canvas>'+
  '      <div    id="SelectionBox"    class="rectangle"></div>'+
  '  </div>'+
  '  <!-- The statusMessage item displays status and error messages, and also recognition results.    -->'+
  '  <div id="statusMessage" aria-label="Recognition results" aria-live="polite" role="region"></div>'+
  '  <!-- The Word item is a dummy, invisible <div> that we position on the selected word.'+
  '          We use it as a marker for the position of the ink in the selected word, since the RecoFlyout must be positioned relative to an HTML element.    -->'+
  '  <div id="Word" aria-label="Word" aria-live="polite" role="region"></div>'+
  '  <!-- This toolbar is displayed across the bottom of the screen.'+
  '          The bottons are shown as cirles with icons in the middle.  The color buttons have IDs'+
  '          which are the names of colors; the ID of each one is fed directly into the strokeStyle'+
  '          of the corresponding canvas.                -->'+
  '  <div id="bottomAppBar" data-win-control="WinJS.UI.AppBar"'+
  '          data-win-options="{sticky: true,'+
  '                          commands:[        {id:\'InkColors\',label:\'Color\',icon:\'fontcolor\',section:\'global\',type:\'flyout\',flyout:\'InkColorFlyout\',tooltip:\'Choose ink color\'},'+
  '                                    {id:\'InkWidth\', label:\'Width\',icon:\'edit\',     section:\'global\',type:\'flyout\',flyout:\'InkWidthFlyout\',tooltip:\'Choose ink width\'},'+
  '                                    {type:\'separator\',id:\'sep\'},'+
  '                                    {id:\'ModeErase\', label:\'Erase\', icon:\'undo\', onclick:eraseMode, section:\'global\',tooltip:\'Switch pen tip to eraser mode\'},'+
  '                                    {id:\'Clear\', label:\'Clear\', icon:\'clear\', onclick:clear},'+
  '                                    {type:\'separator\',id:\'sep\'},'+
  '                                    {id:\'Done\', label:\'Done\', icon:\'accept\', onclick:done},'+
  '                                    {id:\'Cancel\', label:\'Cancel\', icon:\'cancel\', onclick:cancel}]}">'+
  '  </div>'+
  '<div id="InkColorFlyout" data-win-control="WinJS.UI.Menu"'+
  '        data-win-options="{commands:[{id:\'Black\',label:\'Black\',onclick:inkColor},'+
  '                                     {id:\'Blue\', label:\'Blue\', onclick:inkColor},'+
  '                                     {id:\'Red\',  label:\'Red\',  onclick:inkColor},'+
  '                                     {id:\'Yellow\',  label:\'Yellow\',  onclick:inkColor},'+
  '                                     {id:\'Green\',label:\'Green\',onclick:inkColor}]}">'+
  '</div>'+
  '<div id="InkWidthFlyout" data-win-control="WinJS.UI.Menu"'+
  '        data-win-options="{commands:[{id:\'IW2\', label:\'Smallest\',onclick:setInkWidth},'+
  '                                     {id:\'IW4\', label:\'Small\',   onclick:setInkWidth},'+
  '                                     {id:\'IW6\', label:\'Medium\',  onclick:setInkWidth},'+
  '                                     {id:\'IW8\', label:\'Large\',   onclick:setInkWidth},'+
  '                                     {id:\'IW10\',label:\'Largest\', onclick:setInkWidth}]}">'+
  '</div>'+
  '  <!-- The footer is a group of items defined in every Windows Store app built for Windows using JavaScript sample, containing the'+
  '              company name, and links to copyright, trademark, and privacy statements.'+
  '              The items are created by initialize(), defined in footer.js.    -->'+
  '  <div id="footer" role="contentinfo"></div>';
}
