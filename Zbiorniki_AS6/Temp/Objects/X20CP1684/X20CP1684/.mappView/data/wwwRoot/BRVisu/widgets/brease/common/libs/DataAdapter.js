'use strict';
define([
    'brease',
    'libs/d3/d3'
], function ({ core: { Class: SuperClass } }, d3) {

    /**
     * @class widgets.brease.common.libs.DataAdapter
     * DataAdapter
     * @extends brease.core.Class
     *
     * @iatMeta studio:visible
     * false
     */

    const ModuleClass = SuperClass.extend(function DataAdapter(widget) {
            SuperClass.call(this);

            this.widget = widget;
            this.settings = {
                chartMargin: {
                    marginTop: 15,
                    marginRight: 15,
                    marginBottom: 15,
                    marginLeft: 15
                },
                cursorAreaWidth: 20
            };

            this.init();
        }, null),

        p = ModuleClass.prototype;

    p.init = function () {

        this.xAxisAreas = [];
        this.yAxisAreas = [];
        this.xAxisCursorAreas = [];
        this.chartArea = {};

        this.yScales = [];
        this.xScales = [];
        this.xAxisCursors = [];

        this.graphs = [];
        for (const yValues in this.widget.chartItems.yValues) {

            this.graphs.push({
                id: yValues,
                coordinates: []
            });
        }

        this.graphIntersectionPoints = [];
        for (let i = 0; i < this.graphs.length; i = i + 1) {
            this.graphIntersectionPoints[i] = {
                graphId: this.graphs[i].id,
                xCursors: []
            };
        }

        _initializeChartAreas(this);
    };

    p.dispose = function () {
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    // Update
    p.updateScales = function () {

        _updateScales(this);
    };
    p.updateGraphData = function () {

        _updateGraphData(this);
    };
    p.updateCursor = function () {

        _updateCursor(this);
    };

    p.updateZoomLevelLimits = function () {

        _updateZoomLevelLimits(this);
    };

    // Getters
    p.getXAxisAreas = function () {

        return this.xAxisAreas;
    };
    p.getYAxisAreas = function () {

        return this.yAxisAreas;
    };
    p.getXAxisCursorAreas = function () {

        return this.xAxisCursorAreas;
    };
    p.getChartArea = function () {

        return this.chartArea;
    };
    p.getGraphs = function () {

        return this.graphs;
    };

    p.getGraphIntersectionPoints = function () {

        return this.graphIntersectionPoints;
    };

    p.getYAxesMinimum = function () {
        const axisAreas = this.getYAxisAreas();
        let minimum = null;

        if (!this.widget || this.widget.chartItems.length < 1 || this.widget.chartItems.yAxis.length < 0) {
            return minimum;
        }

        for (const axisId in axisAreas) {
            if (Object.prototype.hasOwnProperty.call(axisAreas, axisId)) {
                const axisMinimum = this.widget.chartItems.yAxis[axisId].minimum();
                if (minimum === null || axisMinimum < minimum) {
                    minimum = axisMinimum;
                }
            }
        }

        return minimum;
    };

    p.getYAxesMaximum = function () {
        const axisAreas = this.getYAxisAreas();
        let maximum = null;

        if (!this.widget || this.widget.chartItems.length < 1 || this.widget.chartItems.yAxis.length < 0) {
            return maximum;
        }

        for (const axisId in axisAreas) {
            if (Object.prototype.hasOwnProperty.call(axisAreas, axisId)) {
                const axisMaximum = this.widget.chartItems.yAxis[axisId].maximum();
                if (maximum === null || axisMaximum > maximum) {
                    maximum = axisMaximum;
                }
            }
        }

        return maximum;
    };

    function _createYAxisArea(dataAdapter, axisId, yAxisWidget, yAxisSize) {
        
        const tickLabelDistance = parseFloat(yAxisWidget.getTickLabelDistance());
        const tickLabelRotation = parseFloat(yAxisWidget.getTickLabelRotation()) % 360;
        
        return {
            id: axisId,
            y: dataAdapter.settings.chartMargin['marginTop'],
            width: yAxisSize,
            info: {
                coordinate: 'y',
                position: dataAdapter.widget.chartItems.yAxis[axisId].getAxisPosition(),
                axisLabelDistance: parseInt(yAxisWidget.getAxisLabelDistance(), 10),
                tickLabelDistance: tickLabelDistance || 0,
                tickLabelRotation: tickLabelRotation || 0,
                minZoomLevel: dataAdapter.widget.getMinZoomLevel() / 100,
                maxZoomLevel: dataAdapter.widget.getMaxZoomLevel() / 100,
                format: yAxisWidget.currentFormat(),
                useDigitGrouping: yAxisWidget?.getUseDigitGrouping ? yAxisWidget.getUseDigitGrouping() : false,
                type: 'number'
            }
        };
    }

    function _createXAxisArea(dataAdapter, axisId, xAxisWidget, xAxisSize, xOffsetLeft, xOffsetRight) {
        
        const tickLabelDistance = parseFloat(xAxisWidget.getTickLabelDistance());
        const tickLabelRotation = parseFloat(xAxisWidget.getTickLabelRotation()) % 360;

        return {
            id: axisId,
            x: xOffsetLeft,
            width: xOffsetRight - xOffsetLeft,
            height: xAxisSize,
            info: {
                coordinate: 'x',
                position: xAxisWidget.getAxisPosition(),
                axisLabelDistance: parseInt(xAxisWidget.getAxisLabelDistance(), 10),
                tickLabelDistance: tickLabelDistance || 0,
                tickLabelRotation: tickLabelRotation || 0,
                minZoomLevel: dataAdapter.widget.getMinZoomLevel() / 100,
                maxZoomLevel: dataAdapter.widget.getMaxZoomLevel() / 100
            }
        };
    }
    function _createCursor(dataAdapter, cursorWidget, xCursorId) {
        return {
            id: xCursorId,
            xCursor: cursorWidget._getValue(),
            yValues: [],
            yValueAxes: [],
            markerVisible: [],
            active: false,
            x: -dataAdapter.settings.cursorAreaWidth / 2 + dataAdapter.xAxisAreas[cursorWidget.axisWidget.elem.id].scale(cursorWidget._getValue()),
            y: 0,
            width: dataAdapter.settings.cursorAreaWidth,
            height: dataAdapter.chartArea.height,
            maxAvailableXPositionIndex: cursorWidget._getMaxDrawnXSampleIndex(cursorWidget._getMaxNumberOfSamples())
        //markerRadius: 
        };
    }

    function _setChartMargin(dataAdapter) {
        const parseChartMargin = dataAdapter.widget.settings.chartMargin.split(' ');
        let i = 0;

        for (const pos in dataAdapter.settings.chartMargin) {
            dataAdapter.settings.chartMargin[pos] = parseInt(parseChartMargin[i], 10);
            i = (parseChartMargin[i + 1]) ? i + 1 : 0;
        }
    }

    function _setXScales(axisType, dataAdapter, axisId) {
        switch (axisType) {

            case 'dateTime':
                dataAdapter.xScales[axisId] = d3.time.scale();
                break;

            case 'index':
            case 'secondsAsNumber':
                dataAdapter.xScales[axisId] = d3.scale.linear();
                break;
        }
        //dataAdapter.xScales[axisId] = (typeof xAxisMinValue === 'object') ? d3.time.scale() : d3.scale.linear();;
        dataAdapter.xAxisAreas[axisId].scale = dataAdapter.xScales[axisId];
    }

    // Private Functions
    
    function rightOffset(position, yAxisSize) {
        return (position === 'right') ? yAxisSize : 0;
    }
    function leftOffset(position, yAxisSize) {
        return (position === 'left') ? yAxisSize : 0;
    }
    function topOffset(position, xAxisSize) {
        return (position === 'top') ? xAxisSize : 0;
    }
    function bottomOffset(position, xAxisSize) {
        return (position === 'bottom') ? xAxisSize : 0;
    }
        
    function _initializeChartAreas(dataAdapter) {

        let xOffsetLeft = 0;
        let xOffsetRight = dataAdapter.widget.settings.width;
        let yOffsetTop = 0;
        let yOffsetBottom = dataAdapter.widget.settings.height;
        let xAxisSize = 0;
        let yAxisSize = 0;
        let xAxisWidget;
        let yAxisWidget;

        _setChartMargin(dataAdapter);

        const topBorderWidth = parseInt(dataAdapter.widget.el.css('border-top-width'), 10);
        const bottomBorderWidth = parseInt(dataAdapter.widget.el.css('border-bottom-width'), 10);
        const leftBorderWidth = parseInt(dataAdapter.widget.el.css('border-left-width'), 10);
        const rightBorderWidth = parseInt(dataAdapter.widget.el.css('border-right-width'), 10);
        xOffsetLeft += dataAdapter.settings.chartMargin['marginLeft'];
        xOffsetRight -= dataAdapter.settings.chartMargin['marginRight'] + leftBorderWidth + rightBorderWidth;
        yOffsetTop += dataAdapter.settings.chartMargin['marginTop'];
        yOffsetBottom -= dataAdapter.settings.chartMargin['marginBottom'];

        // Y-Axes (x positioning)
        for (const axisId in dataAdapter.widget.chartItems.yAxis) {

            yAxisWidget = dataAdapter.widget.chartItems.yAxis[axisId];
            yAxisSize = parseInt(dataAdapter.widget.chartItems.yAxis[axisId].settings.width, 10);

            dataAdapter.yAxisAreas[axisId] = _createYAxisArea(dataAdapter, axisId, yAxisWidget, yAxisSize);

            xOffsetRight -= rightOffset(dataAdapter.yAxisAreas[axisId].info.position, yAxisSize);

            dataAdapter.yAxisAreas[axisId].x = (dataAdapter.yAxisAreas[axisId].info.position === 'left') ? xOffsetLeft : xOffsetRight;

            xOffsetLeft += leftOffset(dataAdapter.yAxisAreas[axisId].info.position, yAxisSize);

            dataAdapter.yScales[axisId] = d3.scale.linear();
            dataAdapter.yAxisAreas[axisId].scale = dataAdapter.yScales[axisId];
        }

        // X-Axes
        for (const axisId in dataAdapter.widget.chartItems.xAxis) {

            xAxisWidget = dataAdapter.widget.chartItems.xAxis[axisId];
            xAxisSize = parseInt(xAxisWidget.settings.height, 10);

            dataAdapter.xAxisAreas[axisId] = _createXAxisArea(dataAdapter, axisId, xAxisWidget, xAxisSize, xOffsetLeft, xOffsetRight);

            yOffsetBottom -= bottomOffset(dataAdapter.xAxisAreas[axisId].info.position, xAxisSize);

            dataAdapter.xAxisAreas[axisId].y = (dataAdapter.xAxisAreas[axisId].info.position === 'bottom') ? yOffsetBottom - bottomBorderWidth - topBorderWidth : yOffsetTop;

            yOffsetTop += topOffset(dataAdapter.xAxisAreas[axisId].info.position, xAxisSize);

            _setXScales(xAxisWidget._getAxisType(), dataAdapter, axisId);
        }

        // Y-Axes (y positioning)
        for (const axisId in dataAdapter.widget.chartItems.yAxis) {
            dataAdapter.yAxisAreas[axisId].y = yOffsetTop;
            dataAdapter.yAxisAreas[axisId].height = yOffsetBottom - yOffsetTop - topBorderWidth - bottomBorderWidth;
        }

        // Chart Area
        dataAdapter.chartArea = {
            x: xOffsetLeft,
            y: yOffsetTop,
            width: xOffsetRight - xOffsetLeft,
            height: yOffsetBottom - yOffsetTop - topBorderWidth - bottomBorderWidth
        };

        // Cursor area - Position with respect to the graph area
        for (const xCursorId in dataAdapter.widget.chartItems.xCursors) {
            const cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId];

            dataAdapter.xAxisCursorAreas[xCursorId] = _createCursor(dataAdapter, cursorWidget, xCursorId);

            _setCursorValues(dataAdapter, cursorWidget, xCursorId);
        }

        _addIntersectionPointsToGraphs(dataAdapter);

        dataAdapter._createGraphIntersectionPoints();
    }

    function _setCursorValues(dataAdapter, cursorWidget, xCursorId) {
        for (const graphId in cursorWidget.graphWidgets) {
            const graphWidget = cursorWidget.graphWidgets[graphId];
            let cursorPositionWithinGraphNumberOfSamples;
            let graphNumberOfSamples;

            graphNumberOfSamples = (graphWidget.getNumberOfSamples() < 0) ? graphWidget.getValue().length : graphWidget.getNumberOfSamples();

            cursorPositionWithinGraphNumberOfSamples = cursorWidget.axisWidget._xPositions()
                .map(function (xPosition) {
                    return +xPosition;
                })
                .indexOf(+dataAdapter.xAxisCursorAreas[xCursorId].xCursor) <= (graphNumberOfSamples - 1);

            dataAdapter.xAxisCursorAreas[xCursorId].yValues[graphId] = graphWidget.getCursorValue();
            dataAdapter.xAxisCursorAreas[xCursorId].yValueAxes[graphId] = graphWidget.axisWidget.elem.id;
            dataAdapter.xAxisCursorAreas[xCursorId].markerVisible[graphId] = graphWidget.isVisible() && cursorWidget.isVisible() && cursorPositionWithinGraphNumberOfSamples;
        }
    }

    function _addIntersectionPointsToGraphs(dataAdapter) {
        for (const graph of dataAdapter.graphs) {
            const graphId = graph.id,
                graphWidget = dataAdapter.widget.chartItems.yValues[graphId],
                graphCursorIds = graphWidget.xAxisWidget.cursors,
                graphIntersectionPoints = graph.intersectionPoints = {};

            for (const xCursorId in graphCursorIds) {
                const cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId],
                    graphNumberOfSamples = (graphWidget.getNumberOfSamples() < 0) ? graphWidget.getValue().length : graphWidget.getNumberOfSamples(),
                    cursorPositionWithinGraphNumberOfSamples = cursorWidget.axisWidget._xPositions()
                        .map(function (xPosition) {
                            return +xPosition;
                        })
                        .indexOf(+dataAdapter.xAxisCursorAreas[xCursorId].xCursor) <= (graphNumberOfSamples - 1);

                graphIntersectionPoints[xCursorId] = {
                    xValue: cursorWidget._getValue(),
                    yValues: graphWidget._getYValueFromXCoordinate(cursorWidget._getValue()),
                    yValueAxes: graphWidget.axisWidget.elem.id,
                    markerSize: parseInt(graphWidget.getIntersectionPointSize(), 10),
                    markerEnable: cursorWidget.isEnabled(),
                    markerActive: cursorWidget._getActive(),
                    markerVisible: graphWidget.isVisible() && cursorWidget.isVisible() && cursorPositionWithinGraphNumberOfSamples
                };
            }
        }
    }

    p._createGraphIntersectionPoints = function () {

        const dataAdapter = this;

        this.getGraphIntersectionPoints().forEach(function (graph) {
            const graphId = graph.graphId,
                graphWidget = dataAdapter.widget.chartItems.yValues[graphId],
                graphCursorIds = graphWidget.xAxisWidget.cursors;

            for (const xCursorId in graphCursorIds) {
                const cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId],
                    graphNumberOfSamples = (graphWidget.getNumberOfSamples() < 0) ? graphWidget.getValue().length : graphWidget.getNumberOfSamples(),
                    cursorPositionWithinGraphNumberOfSamples = cursorWidget.axisWidget._xPositions()
                        .map(function (xPosition) {
                            return +xPosition;
                        })
                        .indexOf(+dataAdapter.xAxisCursorAreas[xCursorId].xCursor) <= (graphNumberOfSamples - 1);

                graph.xCursors[xCursorId] = {
                    xValue: cursorWidget._getValue(),
                    yValues: graphWidget._getYValueFromXCoordinate(cursorWidget._getValue()),
                    yValueAxes: graphWidget.axisWidget.elem.id,
                    markerSize: parseInt(graphWidget.getIntersectionPointSize(), 10),
                    markerEnable: cursorWidget.isEnabled(),
                    markerActive: cursorWidget._getActive(),
                    markerVisible: graphWidget.isVisible() && cursorWidget.isVisible() && cursorPositionWithinGraphNumberOfSamples
                };
            }
        });
    };

    p._updateGraphIntersectionPoints = function () {

        const dataAdapter = this;

        this.getGraphIntersectionPoints().forEach(function (graph) {
            const graphId = graph.graphId,
                graphWidget = dataAdapter.widget.chartItems.yValues[graphId],
                graphCursorIds = graphWidget.xAxisWidget.cursors;

            for (const xCursorId in graphCursorIds) {
                const cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId],
                    graphNumberOfSamples = (graphWidget.getNumberOfSamples() < 0) ? graphWidget.getValue().length : graphWidget.getNumberOfSamples(),
                    cursorPositionWithinGraphNumberOfSamples = cursorWidget.axisWidget._xPositions()
                        .map(function (xPosition) {
                            return +xPosition;
                        })
                        .indexOf(+dataAdapter.xAxisCursorAreas[xCursorId].xCursor) <= (graphNumberOfSamples - 1);

                graph.xCursors[xCursorId] = {
                    xValue: cursorWidget._getValue(),
                    yValues: graphWidget._getYValueFromXCoordinate(cursorWidget._getValue()),
                    yValueAxes: graphWidget.axisWidget.elem.id,
                    markerSize: parseInt(graphWidget.getIntersectionPointSize(), 10),
                    markerEnable: cursorWidget.isEnabled(),
                    markerActive: cursorWidget._getActive(),
                    markerVisible: graphWidget.isVisible() && cursorWidget.isVisible() && cursorPositionWithinGraphNumberOfSamples
                };
            }
        });
    };

    function _updateScales(dataAdapter) {

        let axisId;
        let xAxisMinValue;
        let xAxisMaxValue;
        let yAxisMinValue;
        let yAxisMaxValue;

        for (axisId in dataAdapter.yAxisAreas) {

            yAxisMinValue = dataAdapter.widget.chartItems.yAxis[axisId].minimum();
            yAxisMaxValue = dataAdapter.widget.chartItems.yAxis[axisId].maximum();

            if (yAxisMinValue === yAxisMaxValue) {
                if (yAxisMinValue !== 0) {
                    yAxisMinValue = yAxisMinValue * 0.9;
                    yAxisMaxValue = yAxisMaxValue * 1.1;
                } else {
                    yAxisMinValue = -1;
                    yAxisMaxValue = 1;
                }
            }

            dataAdapter.yScales[axisId] = d3.scale.linear()
                .domain([
                    yAxisMinValue,
                    yAxisMaxValue])
                .range([
                    dataAdapter.yAxisAreas[axisId].height,
                    0]);

            dataAdapter.yAxisAreas[axisId].scale = dataAdapter.yScales[axisId];
            dataAdapter.yAxisAreas[axisId].info.format = dataAdapter.widget.chartItems.yAxis[axisId].currentFormat();
        }

        for (axisId in dataAdapter.xAxisAreas) {

            const xAxisWidget = dataAdapter.widget.chartItems.xAxis[axisId];

            xAxisMinValue = xAxisWidget._getMinValue();
            xAxisMaxValue = xAxisWidget._getMaxValue();

            switch (xAxisWidget._getAxisType()) {
                case 'dateTime':
                    dataAdapter.xScales[axisId] = d3.time.scale();
                    dataAdapter.xAxisAreas[axisId].info.type = xAxisWidget._getAxisType();
                    break;

                case 'index':
                case 'secondsAsNumber':
                    dataAdapter.xScales[axisId] = d3.scale.linear();
                    dataAdapter.xAxisAreas[axisId].info.type = xAxisWidget._getAxisType();
                    break;
            }

            dataAdapter.xAxisAreas[axisId].info.format = dataAdapter.widget.chartItems.xAxis[axisId].currentFormat();

            dataAdapter.xScales[axisId]
                .domain([xAxisMinValue, xAxisMaxValue])
                .range([0, dataAdapter.xAxisAreas[axisId].width]);

            dataAdapter.xAxisAreas[axisId].scale = dataAdapter.xScales[axisId];
        }

        _updateGraphData(dataAdapter);
        _updateCursor(dataAdapter);
    }

    function _updateGraphData(dataAdapter) {

        let valueWidget;
        let yAxisWidgetId;
        let xAxisWidgetId;

        for (const graph of dataAdapter.graphs) {

            valueWidget = dataAdapter.widget.chartItems.yValues[graph.id];

            yAxisWidgetId = valueWidget.axisWidget.elem.id;
            xAxisWidgetId = valueWidget.xAxisWidget.elem.id;

            graph.yScale = dataAdapter.yScales[yAxisWidgetId];
            graph.xScale = dataAdapter.xScales[xAxisWidgetId];
            graph.coordinates = valueWidget._coordinates();
            graph.interpolationType = valueWidget.getInterpolationType();
            graph.isHidden = valueWidget.isHidden;
        }
    }

    function _updateCursor(dataAdapter) {

        for (const xCursorId in dataAdapter.widget.chartItems.xCursors) {

            const cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId];

            dataAdapter.xAxisCursorAreas[xCursorId].xCursor = cursorWidget._getValue();
            dataAdapter.xAxisCursorAreas[xCursorId].active = cursorWidget._getActive();
            dataAdapter.xAxisCursorAreas[xCursorId].x = -dataAdapter.settings.cursorAreaWidth / 2 + dataAdapter.xAxisAreas[cursorWidget.axisWidget.elem.id].scale(cursorWidget._getValue());
            dataAdapter.xAxisCursorAreas[xCursorId].y = 0;
            dataAdapter.xAxisCursorAreas[xCursorId].width = dataAdapter.settings.cursorAreaWidth;

            for (const graphId in cursorWidget.graphWidgets) {
                let graphWidget = cursorWidget.graphWidgets[graphId];
                let cursorPositionWithinGraphNumberOfSamples;
                let graphNumberOfSamples;

                graphNumberOfSamples = (graphWidget.getNumberOfSamples() < 0) ? graphWidget.getValue().length : graphWidget.getNumberOfSamples();

                cursorPositionWithinGraphNumberOfSamples = cursorWidget.axisWidget._xPositions()
                    .map(function (xPosition) {
                        return +xPosition;
                    })
                    .indexOf(+dataAdapter.xAxisCursorAreas[xCursorId].xCursor) <= (graphNumberOfSamples - 1);

                dataAdapter.xAxisCursorAreas[xCursorId].markerVisible[graphId] = graphWidget.isVisible() && cursorWidget.isVisible() && cursorPositionWithinGraphNumberOfSamples;
                if (dataAdapter.xAxisCursorAreas[xCursorId].markerVisible[graphId]) {
                    dataAdapter.xAxisCursorAreas[xCursorId].yValues[graphId] = graphWidget._getIntersectionValue(cursorWidget._getValue(), cursorWidget._getActive(), true);
                }
                dataAdapter.xAxisCursorAreas[xCursorId].yValueAxes[graphId] = graphWidget.axisWidget.elem.id;
            }
            dataAdapter.xAxisCursorAreas[xCursorId].maxAvailableXPositionIndex = cursorWidget._getMaxDrawnXSampleIndex(cursorWidget._getMaxNumberOfSamples());
        }

        _updateIntersectionPoints(dataAdapter);

        dataAdapter._updateGraphIntersectionPoints();
    }

    function _updateIntersectionPoints(dataAdapter) {
        for (const graph of dataAdapter.graphs) {
            const graphId = graph.id,
                graphWidget = dataAdapter.widget.chartItems.yValues[graphId],
                graphCursorIds = graphWidget.xAxisWidget.cursors,
                graphIntersectionPoints = graph.intersectionPoints;

            for (const xCursorId in graphCursorIds) {
                const cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId],
                    graphNumberOfSamples = (graphWidget.getNumberOfSamples() < 0) ? graphWidget.getValue().length : graphWidget.getNumberOfSamples(),
                    cursorPositionWithinGraphNumberOfSamples = cursorWidget.axisWidget._xPositions()
                        .map(function (xPosition) {
                            return +xPosition;
                        })
                        .indexOf(+dataAdapter.xAxisCursorAreas[xCursorId].xCursor) <= (graphNumberOfSamples - 1);

                graphIntersectionPoints[xCursorId] = {
                    xValue: cursorWidget._getValue(),
                    yValues: graphWidget._getYValueFromXCoordinate(cursorWidget._getValue()),
                    yValueAxes: graphWidget.axisWidget.elem.id,
                    markerEnable: cursorWidget.isEnabled(),
                    markerActive: cursorWidget._getActive(),
                    markerVisible: graphWidget.isVisible() && cursorWidget.isVisible() && cursorPositionWithinGraphNumberOfSamples
                };
            }
        }
    }

    function _updateZoomLevelLimits(dataAdapter) {
        
        // update y-axes
        for (let axisId in dataAdapter.widget.chartItems.yAxis) {

            dataAdapter.yAxisAreas[axisId].info.minZoomLevel = dataAdapter.widget.getMinZoomLevel() / 100;
            dataAdapter.yAxisAreas[axisId].info.maxZoomLevel = dataAdapter.widget.getMaxZoomLevel() / 100;
        }

        // update x-axes
        for (let axisId in dataAdapter.widget.chartItems.xAxis) {

            dataAdapter.xAxisAreas[axisId].info.minZoomLevel = dataAdapter.widget.getMinZoomLevel() / 100;
            dataAdapter.xAxisAreas[axisId].info.maxZoomLevel = dataAdapter.widget.getMaxZoomLevel() / 100;
        }
    }

    return ModuleClass;
});
