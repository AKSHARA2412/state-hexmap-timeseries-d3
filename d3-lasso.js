(function(d3) {
    d3.lasso = function() {
      let items = null;
      let area = null;
      let on = { start: function() {}, end: function() {} };
      let polygon = [];
      let path, origin;
    function lasso(selection) {
    const g = selection.append("g").attr("class", "lasso");
        path = g.append("path")
          .attr("class", "drawn")
          .attr("fill", "#0bb")
          .attr("fill-opacity", 0.1)
          .attr("stroke", "#0bb")
          .attr("stroke-dasharray", "3,3");
  
        area.on("mousedown.lasso", mousedown)
            .on("mousemove.lasso", mousemove)
            .on("mouseup.lasso", mouseup);
      }
  
      function mousedown(event) {
        polygon = [];
        origin = d3.pointer(event);
        path.attr("d", null);
        on.start();
      }
  
      function mousemove(event) {
        if (!origin) return;
  
        const point = d3.pointer(event);
        polygon.push(point);
  
        const d = "M" + polygon.map(p => `${p[0]},${p[1]}`).join("L");
        path.attr("d", d);
      }
  
      function mouseup() {
        if (!origin || polygon.length <= 2) {
          path.attr("d", null);
          polygon = [];
          origin = null;
          on.end();
          return;
        }
        if (items) {
          items.each(function(d) {
            const bbox = this.getBBox();
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            const inside = d3.polygonContains(polygon, [cx, cy]);
            d3.select(this).classed("selected", inside);
          });
        }
        polygon = [];
        origin = null;
        on.end();
      }
  
      lasso.items = function(_) {
        if (!arguments.length) return items;
        items = _;
        return lasso;
      };
  
      lasso.targetArea = function(_) {
        if (!arguments.length) return area;
        area = _;
        return lasso;
      };
  
      lasso.on = function(type, cb) {
        if (!arguments.length) return on;
        on[type] = cb;
        return lasso;
      };
  
      lasso.selectedItems = function() {
        return items.filter(function() {
          return d3.select(this).classed("selected");
        });
      };
  
      return lasso;
    };
  })(d3);
  

