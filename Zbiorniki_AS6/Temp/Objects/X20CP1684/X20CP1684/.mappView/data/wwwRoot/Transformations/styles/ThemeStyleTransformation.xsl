<?xml version="1.0" encoding="utf-8"?>
<!--
// COPYRIGHT B&R
// Stylesheet to create SCSS for Styles in Themes (widgets and types)
// Input: a file which includes all Style entries of a theme
// requires the .type file for types and the .widget file for widgets and PropertyCollections (=StructuredProperty)
// runs in Content Editor (CE) only
-->
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:wdgst="http://www.br-automation.com/iat2015/styles/engineering/v1"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:widget="http://www.br-automation.com/iat2014/widget"
      xmlns:widgetList="http://www.br-automation.com/iat2015/widgetListDefinition/v2"
      xmlns="http://www.br-automation.com/iat2015/styles/engineering/v1">

  <xsl:output method="text" encoding="UTF-8" indent="yes" />

  <!-- elpathdelimiter: for e.g. Linux -->
  <xsl:param name="elpathdelimiter">/</xsl:param>
  <!-- systemTypePath: path to system types, e.g. <systemTypePath>Tooltip.type -->
  <xsl:param name="systemTypePath" select="'../../types/'"></xsl:param>
  <!-- widgetTypePath: path to widgets, e.g. <widgetTypePath>widgets/brease/Button/meta/Button.widget -->
  <xsl:param name="widgetTypePath" select="'../../../mappview-components/data/wwwRoot/BRVisu/'"></xsl:param>
  <!-- useWidgetIndex: indicator if widgetIndex should be used; true for ASB, false for CE (in CE all widgets are used)-->
  <xsl:param name="useWidgetIndex">false</xsl:param>
  <!-- widgetIndexPath: path to a xml list of used widgets with their path (<widgets><widget type="widgets.brease.Button" path="..."/></widgets>)-->
  <xsl:param name="widgetIndexPath" select="'BR.IAT.widgetsfile'"></xsl:param>

  <!-- include in same directory, as href does not allow to apply xsl:with-param -->
  <xsl:include href="HelperFunctions.xsl"/>

  <!-- entry point -->
  <xsl:template match="wdgst:Styles">
    <xsl:text>@use "mixins.scss";&#xa;@use "sass:color";&#xa;@use "sass:list";&#xa;@use "sass:math";&#xa;@use "sass:string";&#xa;</xsl:text>

    <xsl:for-each select="wdgst:Style">
      <!-- @use rules have to be at the beginning of the file and have to be unique -->
      <xsl:variable name="xsiType" select="@xsi:type" />
      <xsl:if test="not(preceding::wdgst:Style[@xsi:type = $xsiType])">
        <xsl:call-template name="createRules">
          <xsl:with-param name="entryType" select="'useRule'"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:for-each>
    <xsl:text>&#xa;</xsl:text>

    <xsl:for-each select="wdgst:Style">
      <!-- style with id='default' has to be first, as other styles have to be able to override it -->
      <xsl:if test="@id='default'">
        <xsl:call-template name="createRules">
          <xsl:with-param name="entryType" select="'cssClass'"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:for-each>

    <xsl:for-each select="wdgst:Style">
      <xsl:if test="not(@id='default')">
        <xsl:call-template name="createRules">
          <xsl:with-param name="entryType" select="'cssClass'"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="createRules">
    <xsl:param name="entryType"></xsl:param>
    <xsl:variable name="xsiType" select="@xsi:type" />

    <!-- first part of css class name, e.g 'widgets_brease_Button' for 'widgets.brease.Button' -->
    <xsl:variable name="styleNamePrefix">
      <xsl:call-template name="string-replace-all">
        <xsl:with-param name="text" select="$xsiType" />
        <xsl:with-param name="replace" select="'.'"/>
        <xsl:with-param name="by" select="'_'" />
      </xsl:call-template>
    </xsl:variable>

    <!-- itemName is last part of fully qualified name -->
    <!-- e.g. 'Button' for 'widgets.brease.Button' or 'Axis' for 'widgets.development.StructPropWidget.Axis' -->
    <xsl:variable name="itemName">
      <xsl:call-template name="get-item-name">
        <xsl:with-param name="xsiType" select="$xsiType"></xsl:with-param>
      </xsl:call-template>
    </xsl:variable>

    <!-- number of parts of fully qualified name -->
    <xsl:variable name="namespaceDepth">
      <xsl:choose>
        <xsl:when test="$useWidgetIndex='false'">
          <xsl:call-template name="count-elements">
            <xsl:with-param name="count" select="0" />
            <xsl:with-param name="text" select="$xsiType" />
            <xsl:with-param name="separator" select="'.'" />
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="-1"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="isStructuredProperty">
      <xsl:choose>
        <xsl:when test="$useWidgetIndex='false'">
          <xsl:choose>
            <!-- workaround to identify StructuredProperty -->
            <xsl:when test="$namespaceDepth=4">
              <xsl:value-of select="'true'"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="'false'"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="document($widgetIndexPath)//widgetList:StructuredProperty[@name=$xsiType]">
              <xsl:value-of select="'true'"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="'false'" />
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- xsiType of the widget a StructuredProperty belongs to; otherwise of the widget itself -->
    <xsl:variable name="relatedWidget">
      <xsl:choose>
        <xsl:when test="$isStructuredProperty='true'">
          <xsl:value-of select="substring-before($xsiType, concat('.',$itemName))" />
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$xsiType" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- distinction between widget, structuredProperty and system (=global styles, e.g. system.brease.Tooltip) -->
    <xsl:variable name="itemType">
      <xsl:choose>
        <xsl:when test="starts-with(@xsi:type,'system.')">
          <xsl:value-of select="'system'"/>
        </xsl:when>
        <xsl:when test="$isStructuredProperty='true'">
          <xsl:value-of select="'structuredProperty'"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="'widget'"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    
    <!-- detect if widget is used -->
    <!-- in CE all widgets are used -->
    <!-- in ASB we look into the index file -->
    <!-- system types are always used -->
    <xsl:variable name="isWidgetInUse">
      <xsl:choose>
        <xsl:when test="$itemType='system'">
          <xsl:value-of select="'true'"/>
        </xsl:when>
        <xsl:when test="$useWidgetIndex='false'">
          <xsl:value-of select="'true'"/>
        </xsl:when>
        <xsl:when test="document($widgetIndexPath)/widgetList:widgets/widgetList:widget[@name=$relatedWidget]/@name">
          <xsl:value-of select="'true'"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="'false'" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <!-- create entry for Style for used widgets and all system styles-->
    <xsl:if test="$isWidgetInUse='true'">

    <!-- read itemPath from index file in ASB -->
    <xsl:variable name="itemPathFromIndexFile">
      <xsl:choose>
        <xsl:when test="$itemType='system'">
          <xsl:value-of select="'not-used'"/>
        </xsl:when>
        <xsl:when test="$useWidgetIndex='false'">
          <xsl:value-of select="'noIndexFile'"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="document($widgetIndexPath)/widgetList:widgets/widgetList:widget[@name=$relatedWidget]/@path" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
      <!-- class path of item -->
      <!-- e.g. "widgets/brease/Button" for widgets.brease.Button -->
      <!-- e.g. "widgets/brease/OnlineChartHDA" for widgets.brease.OnlineChartHDA.Graph -->
      <!-- not used for system styles-->
      <xsl:variable name="itemClassPath">
        <xsl:choose>
          <xsl:when test="$itemType='system'">
            <xsl:value-of select="'not-used'"/>
          </xsl:when>
          <xsl:when test="$itemType='structuredProperty'">
            <xsl:call-template name="string-replace-all">
              <xsl:with-param name="text" select="$relatedWidget" />
              <xsl:with-param name="replace" select="'.'" />
              <xsl:with-param name="by" select="$elpathdelimiter" />
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="string-replace-all">
              <xsl:with-param name="text" select="$xsiType" />
              <xsl:with-param name="replace" select="'.'" />
              <xsl:with-param name="by" select="$elpathdelimiter" />
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <!-- full path to folder of item -->
      <!-- e.g. in CE "../../BRVisu/widgets/brease/Button" -->
      <!-- e.g. in ASB "C:/Program%20Files/BrAutomation/AS6/AS/TechnologyPackages/mappView/6.0/Widgets/brease/Button" -->
      <!-- not used for system styles-->
      <xsl:variable name="widgetMetaPath">
        <xsl:choose>
          <xsl:when test="$itemType='system'">
            <xsl:value-of select="'not-used'"/>
          </xsl:when>
            <xsl:when test="$useWidgetIndex='false'">
          <xsl:value-of select="concat($widgetTypePath,$itemClassPath,$elpathdelimiter,'meta',$elpathdelimiter)"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="concat($itemPathFromIndexFile,$elpathdelimiter,'meta',$elpathdelimiter)"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <!-- path to .widget or .type file -->
      <xsl:variable name="typeFilePath">
        <xsl:call-template name="getTypeFilePath">
          <xsl:with-param name="widgetMetaPath" select="$widgetMetaPath"/>
          <xsl:with-param name="itemName" select="$itemName"/>
          <xsl:with-param name="itemType" select="$itemType"/>
        </xsl:call-template>
      </xsl:variable>

      <xsl:choose>
        <xsl:when test="$entryType='useRule'">
          <xsl:call-template name="writeUseRule">
            <xsl:with-param name="widgetMetaPath" select="$widgetMetaPath"/>
            <xsl:with-param name="itemName" select="$itemName"/>
            <xsl:with-param name="itemType" select="$itemType"/>
            <xsl:with-param name="styleNamePrefix" select="$styleNamePrefix"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="writeCSSClass">
            <xsl:with-param name="styleNamePrefix" select="$styleNamePrefix"/>
            <xsl:with-param name="typeFilePath" select="$typeFilePath"/>
            <xsl:with-param name="itemName" select="$itemName"/>
            <xsl:with-param name="itemType" select="$itemType"/>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
      
    </xsl:if>
  </xsl:template>

  <!-- @use rule for _base mixin -->
  <xsl:template name="writeUseRule">
    <xsl:param name="widgetMetaPath"></xsl:param>
    <xsl:param name="itemName"></xsl:param>
    <xsl:param name="itemType"></xsl:param>
    <xsl:param name="styleNamePrefix"></xsl:param>
    <xsl:text>@use "</xsl:text>
    <xsl:choose>
      <xsl:when test="$itemType='system'">
        <xsl:value-of select="concat($systemTypePath,$itemName)"/>
      </xsl:when>
      <xsl:when test="$itemType='structuredProperty'">
        <xsl:value-of select="concat($widgetMetaPath,$itemName,$elpathdelimiter,$itemName)"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat($widgetMetaPath,$itemName)"/>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text>_base" as </xsl:text>
    <xsl:value-of select="$styleNamePrefix"/>
    <xsl:text>;&#xa;</xsl:text>
  </xsl:template>

  <!-- css class entry -->
  <xsl:template name="writeCSSClass">
    <xsl:param name="styleNamePrefix"></xsl:param>
    <xsl:param name="typeFilePath"></xsl:param>
    <xsl:param name="itemName"></xsl:param>
    <xsl:param name="itemType"></xsl:param>
  <xsl:text>.</xsl:text>
      <xsl:value-of select="$styleNamePrefix"/>
      <xsl:text>_style_</xsl:text>
      <xsl:value-of select="@id"/><!-- Style-ID-->
      <xsl:text> {&#xa;</xsl:text>
      <xsl:text>@include </xsl:text>
      <xsl:value-of select="$styleNamePrefix"/>
      <xsl:text>.base;&#xa;</xsl:text><!--ref to base mixin, e.g. "widgets_brease_Button.base" -->
      <!-- process each styleable property -->
      <xsl:for-each select="@*">
        <xsl:if test="not(name()='id' or name()='xsi:type')">
          <xsl:call-template name="createEntry">
            <xsl:with-param name="typeFilePath" select="$typeFilePath"></xsl:with-param>
            <xsl:with-param name="itemName" select="$itemName"></xsl:with-param>
            <xsl:with-param name="itemType" select="$itemType"></xsl:with-param>
          </xsl:call-template>
        </xsl:if>
      </xsl:for-each>
      <xsl:text>&#xa;}&#xa;</xsl:text>
  </xsl:template>

  <!-- create entry for styleable property -->
  <xsl:template name="createEntry">
    <xsl:param name="typeFilePath"></xsl:param>
    <xsl:param name="itemName"></xsl:param>
    <xsl:param name="itemType"></xsl:param>
    <xsl:variable name="propertyName" select="name()"></xsl:variable>
    <xsl:variable name="propertyValue" select="."></xsl:variable>
    <!-- selector // is necessary, as the path is different in .widget and .type files -->
    <xsl:for-each select="document($typeFilePath)//widget:StyleProperty[@name=$propertyName]/widget:StyleElement">
      <xsl:variable name="replacedAttribute">
        <xsl:choose>
          <xsl:when test="contains(@attribute,'@include ') and not(contains(@attribute,'@include mixins.'))">
            <xsl:call-template name="string-replace">
              <xsl:with-param name="text" select="@attribute" />
              <xsl:with-param name="replace" select="'@include '" />
              <xsl:with-param name="by" select="'@include mixins.'" />
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="@attribute"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      <xsl:choose>
        <xsl:when test="@indexed">
          <xsl:call-template name="generateDynamicSelectors">
            <xsl:with-param name="value" select="$propertyValue" />
            <xsl:with-param name="attribute" select="$replacedAttribute" />
            <xsl:with-param name="selector" select="@selector" />
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="generateStaticSelector">
            <xsl:with-param name="value" select="$propertyValue" />
            <xsl:with-param name="attribute" select="$replacedAttribute" />
            <xsl:with-param name="selector" select="@selector" />
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="generateStaticSelector">
    <xsl:param name="value"></xsl:param>
    <xsl:param name="attribute"></xsl:param>
    <xsl:param name="selector"></xsl:param>
    <xsl:choose>
      <xsl:when test="not($selector) or $selector=''">
        <xsl:call-template name="generateValue">
          <xsl:with-param name="value" select="$value"></xsl:with-param>
          <xsl:with-param name="attribute" select="$attribute"></xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$selector"/>
        <xsl:text> {&#xa;</xsl:text>
        <xsl:call-template name="generateValue">
          <xsl:with-param name="value" select="$value"></xsl:with-param>
          <xsl:with-param name="attribute" select="$attribute"></xsl:with-param>
        </xsl:call-template>
        <xsl:text>}&#xa;</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="generateDynamicSelectors">
    <xsl:param name="attribute" />
    <xsl:param name="selector" />
    <xsl:param name="value" />
    <xsl:variable name="listLength">
      <xsl:call-template name="get-list-length">
        <xsl:with-param name="value" select="$value" />
      </xsl:call-template>
    </xsl:variable>
    <xsl:call-template name="dynamicLines">
      <xsl:with-param name="pStart" select="1"/>
      <xsl:with-param name="pEnd" select="$listLength"/>
      <xsl:with-param name="value" select="$value" />
      <xsl:with-param name="attribute" select="$attribute" />
      <xsl:with-param name="selector" select="$selector" />
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="dynamicLines">
    <xsl:param name="pStart"/>
    <xsl:param name="pEnd"/>
    <xsl:param name="value" />
    <xsl:param name="attribute" />
    <xsl:param name="selector" />
    <xsl:if test="not($pStart > $pEnd)">
      <xsl:choose>
        <xsl:when test="$pStart = $pEnd">
          <xsl:variable name="index" select="$pStart"/>
          <xsl:variable name="replacedAttribute">
            <xsl:call-template name="string-replace-all">
              <xsl:with-param name="text" select="$attribute" />
              <xsl:with-param name="replace" select="'$index'" />
              <xsl:with-param name="by" select="$index" />
            </xsl:call-template>
          </xsl:variable>
          <xsl:variable name="replacedSelector">
            <xsl:call-template name="string-replace-all">
              <xsl:with-param name="text" select="$selector" />
              <xsl:with-param name="replace" select="'$index'" />
              <xsl:with-param name="by" select="$index" />
            </xsl:call-template>
          </xsl:variable>
          <xsl:value-of select="$replacedSelector"/>
          <xsl:text>{&#xa;&#x9;&#x9;</xsl:text>
          <xsl:call-template name="generateValue">
            <xsl:with-param name="value" select="$value" />
            <xsl:with-param name="attribute" select="$replacedAttribute" />
          </xsl:call-template>
          <xsl:text>&#x9;}&#xa;</xsl:text>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="vMid" select="floor(($pStart + $pEnd) div 2)"/>
          <xsl:call-template name="dynamicLines">
            <xsl:with-param name="pStart" select="$pStart"/>
            <xsl:with-param name="pEnd" select="$vMid"/>
            <xsl:with-param name="value" select="$value" />
            <xsl:with-param name="attribute" select="$attribute" />
            <xsl:with-param name="selector" select="$selector" />
          </xsl:call-template>
          <xsl:call-template name="dynamicLines">
            <xsl:with-param name="pStart" select="$vMid+1"/>
            <xsl:with-param name="pEnd" select="$pEnd"/>
            <xsl:with-param name="value" select="$value" />
            <xsl:with-param name="attribute" select="$attribute" />
            <xsl:with-param name="selector" select="$selector" />
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <!-- generate value for stylable attribute-->
  <xsl:template name="generateValue">
    <xsl:param name="value"></xsl:param>
    <xsl:param name="attribute"></xsl:param>
    <xsl:choose>
      <xsl:when test="contains($attribute,'$value')">
        <xsl:call-template name="string-replace-all">
          <xsl:with-param name="text" select="$attribute" />
          <xsl:with-param name="replace" select="'$value'" />
          <xsl:with-param name="by" select="$value" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:text>&#x9;</xsl:text>
        <xsl:value-of select="$attribute"/>
        <xsl:text>: </xsl:text>
        <xsl:choose>
          <xsl:when test="$attribute='font-family'">
            <xsl:call-template name="quote-font-names">
              <xsl:with-param name="text" select="$value" />
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$value"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text>;&#xa;</xsl:text>
  </xsl:template>

</xsl:stylesheet>
