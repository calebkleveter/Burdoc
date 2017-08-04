Vue.component('burdoc-documents', {
  template: `
  <div id="documents">
    <div id="docs-loop" v-for="document in documents">
      <div class="document col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <div class="identifier">
          <p>{{ document.titleCharacter }}</p>
        </div>
        <div class="title">
          <p>{{ document.title }}</p>
        </div>
      </div>
    </div>
  </div>
  `,
  data: function(){
    return {
      documents: [
        {titleCharacter: 'T', title: "Test Doc"},
        {titleCharacter: 'B', title: "Burdoc"},
        {titleCharacter: 'O', title: "On War and Peace"},
        {titleCharacter: 'U', title: "User Authentication in Vapor 2"},
        {titleCharacter: 'R', title: "The Revenge of the Swift"},
        {titleCharacter: '1', title: "101 Ways to Eat Eggplant"},
        {titleCharacter: 'C', title: "Click Me"},
        {titleCharacter: 'M', title: "The Middle Man"},
        {titleCharacter: 'S', title: "Schindler\'s List"},
      ]
    }
  }
});
