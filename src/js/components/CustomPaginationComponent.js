(function () {
   'use strict';

   /**
    * Custom pagination component
    */
   CoreLibrary.CustomPaginationComponent = CoreLibrary.Component.subclass({
      htmlTemplate: '<div class="kw-pagination l-flexbox l-pack-justify l-flex-1 l-align-stretch">' +
      '<span rv-each-page="pages" rv-on-click="page.clickEvent" rv-class-kw-active-page="page.selected"' +
      'class="KambiWidget-card-border-color kw-page-link l-flexbox l-pack-center l-align-center l-flex-1" >' +
      '<span class="KambiWidget-primary-background-color kw-custom-border"></span>' +
      '{page.text}' +
      '</span>' +
      '</div>',
      constructor ( htmlElement, mainComponentScope, scopeKey, pageSize, maxVisiblePages ) {
         CoreLibrary.Component.apply(this, [{
            rootElement: htmlElement
         }]);
         this.pageSize = pageSize ? pageSize : 3;
         this.maxVisiblePages = maxVisiblePages ? maxVisiblePages : 5;
         this.scope.currentPage = 0;
         this.scope.firstPage = true;
         this.scope.lastPage = false;

         /*
          creates a new array with name _scopeKey
          the component should use this array when it wants only the data
          of the currentPage
          */
         mainComponentScope['_' + scopeKey] = [];
         this.originalArray = mainComponentScope[scopeKey];
         this.currentPageArray = mainComponentScope['_' + scopeKey];

         // watching for changes in the original array
         sightglass(mainComponentScope, scopeKey, function () {
            this.originalArray = mainComponentScope[scopeKey];
            this.setCurrentPage(0);
            this.clearArray();
            this.adaptArray();
         }.bind(this));

         this.adaptArray();
      },

      clearArray: function () {
         this.currentPageArray.splice(0, this.currentPageArray.length);
      },

      /**
       * Returns current page
       * @returns {number|*}
       */
      getCurrentPage () {
         return this.scope.currentPage;
      },

      /**
       * Sets current page number
       * @param pageNumber
       */
      setCurrentPage ( pageNumber ) {
         if ( pageNumber === this.getCurrentPage() ) {
            return;
         }
         if ( pageNumber < 0 || pageNumber >= this.getNumberOfPages() ) {
            throw new Error('Invalid page number');
         }
         this.scope.currentPage = pageNumber;
         this.adaptArray();
      },

      /**
       * Return the number of pages based on limit set
       * @returns {number}
       */
      getNumberOfPages () {
         return Math.ceil(this.originalArray.length / this.pageSize);
      },

      /**
       * Changes the _scopeKey array to match the current page elements
       */
      adaptArray () {
         this.clearArray();
         var startItem = this.getCurrentPage() * this.pageSize;
         var endItem = startItem + this.pageSize;
         if ( endItem >= this.originalArray.length ) {
            endItem = this.originalArray.length;
         }
         for ( var i = startItem; i < endItem; ++i ) {
            this.currentPageArray.push(this.originalArray[i]);
         }

         this.scope.firstPage = this.getCurrentPage() === 0;
         this.scope.lastPage = this.getCurrentPage() === this.getNumberOfPages() - 1;

         this.render();
      },

      /**
       *  Renders the component at init
       */
      init () {
         this.render();
      },

      /**
       * Updates the scope.pages value which is used to render the page numbers and arrows
       */
      render () {
         this.scope.pages = [];
         var maxVisiblePages = this.maxVisiblePages,
            currentPage = this.getCurrentPage(),
            pageCount = this.getNumberOfPages(),
            startPage = 0,
            endPage = pageCount;

         if ( maxVisiblePages < pageCount ) {
            // Keep active page in middle by adjusting start and end
            startPage = Math.max(currentPage - Math.ceil(maxVisiblePages / 3), 0);
            endPage = startPage + maxVisiblePages;
            // Shift the list start and end
            if ( endPage > pageCount ) {
               endPage = pageCount;
               startPage = endPage - maxVisiblePages;
            }
         }

         for ( var i = startPage; i <= endPage - 1; i++ ) {
            this.scope.pages.push({
               text: this.originalArray[i].groupName,
               number: i,
               selected: i === this.getCurrentPage(),
               clickEvent: this.setCurrentPage.bind(this, i) // calls setCurrentPage with i as a parameter
            });
         }
      }
   });

})();
