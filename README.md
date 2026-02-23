Project Title: US State Revenue and Expense Trends Visualization

Project Overview:

This project presents an interactive data visualization exploring U.S. state-level financial metrics over time.

It combines a geographic hex-based state map with a dynamic multi-line chart to enable comparative temporal analysis.

Users can explore trends across different financial attributes and examine how selected states evolve from 1992 to 2019.

Data Description:

The dataset contains U.S. state-level finance data spanning 1992–2019.

Multiple financial attributes are included, such as revenue, expenses, general revenue, general expenditure, and capital outlay.

Each state has yearly records, enabling longitudinal trend analysis and cross-state comparisons.

Visualization Design and Techniques:

A hex-based geographic layout approximates U.S. state positioning.

States are color-encoded using a continuous sequential scale mapped to selected financial attributes.

A dynamic color legend updates to reflect current scale ranges.

A linked multi-line chart displays trends for selected states across all years.

Each line represents a state, with labels positioned at the end of the line.

A vertical indicator line highlights the currently selected year.

Interactive Features:

Attribute selector allows switching between financial metrics.

Year slider enables temporal navigation.

Play/Pause control animates year progression.

Lasso selection on the hex map allows selecting multiple states simultaneously.

The line chart updates dynamically based on current state selection.

Smooth D3 transitions are used for updates, additions, and removals to maintain visual continuity.

Technical Highlights:

Built using D3.js v7.

Implements D3 joins and transitions for smooth updates.

Synchronizes interactions between map and line chart components.

Designed with clear layout separation between control panel, map, and chart for usability.

Key Insights:

Enables side-by-side comparison of financial growth patterns across states.

Highlights long-term trends and cyclical changes in public finance data.

Demonstrates effective use of linked visualizations for exploratory analysis.
