<?xml version="1.0" encoding="utf-8"?>
<!--
// COPYRIGHT B&R
// Transformation to create the default SCSS of types (Page, Area, etc.)
// For widgets a JavaScript replacement is used.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:wdgst="http://www.br-automation.com/iat2014/widget"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns="http://www.br-automation.com/iat2014/widget">
  <xsl:output method="text" encoding="UTF-8" indent="yes" />
  <!-- include in same directory, as href does not allow the use of a param-->
  <xsl:include href="HelperFunctions.xsl"/>
  <xsl:param name="createBase">false</xsl:param>
  <xsl:param name="nameSpace">system_brease_</xsl:param>
  <xsl:template match="*" mode="copy-no-namespaces">
    <xsl:element name="{name(.)}">
      <xsl:copy-of select="@*"/>
      <xsl:apply-templates mode="copy-no-namespaces"/>
    </xsl:element>
  </xsl:template>
  <!-- entry point for widgets -->
  <xsl:template match="/wdgst:WidgetLibrary">
    <xsl:variable name="widgetName" select="wdgst:Widget/@name" />
    <xsl:variable name="widgetFullName">
      <xsl:call-template name="string-replace-all">
        <xsl:with-param name="text" select="wdgst:Widget/@name" />
        <xsl:with-param name="replace" select="'.'"/>
        <xsl:with-param name="by" select="'_'" />
      </xsl:call-template>
    </xsl:variable>
    <xsl:call-template name="createDefaultStyle">
      <xsl:with-param name="widgetName" select="$widgetName" />
      <xsl:with-param name="widgetFullName" select="$widgetFullName" />
    </xsl:call-template>
  </xsl:template>
  <!-- entry point for types -->
  <xsl:template match="/wdgst:Area | wdgst:Body | wdgst:ChangePasswordDialog | wdgst:Content | wdgst:Dialog | wdgst:ElementFocus | wdgst:Focus | wdgst:MessageBox | wdgst:ModalDimmer | wdgst:Page | wdgst:Scrollbar | wdgst:Selection | wdgst:StartupProgressBar | wdgst:SystemLogin | wdgst:TableConfigurationDialog | wdgst:Tooltip">
    <xsl:variable name="widgetName" select="name()" />
    <xsl:variable name="widgetFullName" select="concat($nameSpace, name())" />
    <xsl:call-template name="createDefaultStyle">
      <xsl:with-param name="widgetName" select="$widgetName" />
      <xsl:with-param name="widgetFullName" select="$widgetFullName" />
    </xsl:call-template>
  </xsl:template>
  <!--Creation of the default Style less-->
  <xsl:template name="createDefaultStyle">
    <xsl:param name="widgetName"></xsl:param>
    <xsl:param name="widgetFullName"></xsl:param>
    <xsl:if test="//wdgst:StyleProperties">
      <xsl:for-each select="//wdgst:StyleProperties">
        <xsl:if test="wdgst:StyleProperty">
          <!-- Creation of the Base Style class based on default values-->
          <xsl:if test="contains($createBase,'true')">
            <xsl:text>@use "mixins.scss";&#xa;</xsl:text>
            <xsl:for-each select="wdgst:StyleProperty">
              <xsl:call-template name="createPropertyMixin">
              </xsl:call-template>
            </xsl:for-each>
            <xsl:text>&#xa;@mixin base</xsl:text>
            <xsl:text> {&#xa;</xsl:text>
            <xsl:for-each select="wdgst:StyleProperty">
              <xsl:call-template name="createPropertyInclude">
                <xsl:with-param name="widgetFullName" select="$widgetFullName" />
              </xsl:call-template>
            </xsl:for-each>
            <xsl:text>}&#xa;&#xa;</xsl:text>
          </xsl:if>
          <!-- Creation of the default Style class based on the base class-->
          <xsl:if test="contains($createBase,'false')">
            <xsl:text>@use "</xsl:text>
            <xsl:value-of select="$widgetFullName"/>
            <xsl:text>_base.scss" as </xsl:text>
            <xsl:value-of select="$widgetFullName"/>
            <xsl:text>;&#xa;</xsl:text>
            <xsl:text>.</xsl:text>
            <xsl:value-of select="$widgetFullName"/>
            <xsl:text>_style_default</xsl:text>
            <xsl:text> {&#xa;</xsl:text>
            <xsl:text>@include </xsl:text>
            <xsl:value-of select="$widgetFullName"/>
            <xsl:text>.base </xsl:text>
            <xsl:text>&#xa;}&#xa;</xsl:text>
          </xsl:if>
        </xsl:if>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
  <xsl:template name="createPropertyInclude">
    <xsl:param name="widgetFullName"></xsl:param>
    <xsl:choose>
      <xsl:when test="@default">
        <xsl:text>  @include prop_</xsl:text>
        <xsl:value-of select="@name"/>
        <xsl:text>;&#xa;</xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:message terminate="yes">
        Error: no default value for property
          <xsl:value-of select="@name"/> in widget
          <xsl:value-of select="$widgetFullName"/>.
        </xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="createPropertyMixin">
    <xsl:if test="@default">
      <xsl:variable name="value" select="@default" />
      <xsl:text>&#xa;@mixin prop_</xsl:text>
      <xsl:value-of select="@name"/>
      <xsl:text> {&#xa;</xsl:text>
      <xsl:for-each select="wdgst:StyleElement">
        <xsl:variable name="replacedAttribute">
          <xsl:call-template name="string-replace">
            <xsl:with-param name="text" select="@attribute" />
            <xsl:with-param name="replace" select="'@include '" />
            <xsl:with-param name="by" select="'@include mixins.'" />
          </xsl:call-template>
        </xsl:variable>
        <xsl:choose>
          <xsl:when test="@indexed">
            <xsl:call-template name="generateDynamicSelectors">
              <xsl:with-param name="attribute" select="$replacedAttribute" />
              <xsl:with-param name="selector" select="@selector" />
              <xsl:with-param name="value" select="$value" />
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="generateStaticSelector">
              <xsl:with-param name="attribute" select="$replacedAttribute" />
              <xsl:with-param name="selector" select="@selector" />
              <xsl:with-param name="value" select="$value" />
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
      <xsl:text>}</xsl:text>
    </xsl:if>
  </xsl:template>
  <xsl:template name="generateStaticSelector">
    <xsl:param name="attribute" />
    <xsl:param name="selector" />
    <xsl:param name="value" />
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
  <xsl:template name="generateValue">
    <xsl:param name="value"></xsl:param>
    <xsl:param name="attribute"></xsl:param>
    <xsl:variable name="preattr">
      <xsl:choose>
        <xsl:when test="contains($attribute,'$value')">
          <xsl:variable name="outattr">
            <xsl:call-template name="string-replace-all">
              <xsl:with-param name="text" select="$attribute" />
              <xsl:with-param name="replace" select="'$value'" />
              <xsl:with-param name="by" select="$value" />
            </xsl:call-template>
          </xsl:variable>
          <xsl:text>&#x9;</xsl:text>
          <xsl:value-of select="$outattr"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>&#x9;</xsl:text>
          <xsl:value-of select="$attribute"/>
          <xsl:text>: </xsl:text>
          <xsl:value-of select="$value"/>
          <xsl:if test="@calc">
            <xsl:value-of select="@calc"/>
          </xsl:if>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:value-of select="$preattr"/>
    <xsl:text>;&#xa;</xsl:text>
  </xsl:template>
</xsl:stylesheet>
