<?xml version="1.0" encoding="utf-8"?>
<!--
// COPYRIGHT B&R
// Transformation to create JSON for types (Page, Area, etc.)
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:wdgst="http://www.br-automation.com/iat2014/widget"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns="http://www.br-automation.com/iat2014/widget">

  <xsl:output method="text" encoding="UTF-8" indent="yes" />

  <xsl:param name="last">false</xsl:param>
  <xsl:param name="first">false</xsl:param>
  <xsl:param name="nameSpace">system.brease.</xsl:param>

  <!-- entry point for types -->
  <xsl:template match="/*">
    
    <xsl:variable name="typeName" select="concat($nameSpace, name())" />
    <xsl:if test="contains($first,'true')">
      <xsl:text>{
</xsl:text>
    </xsl:if>
    <xsl:text>"</xsl:text><xsl:value-of select="$typeName"/><xsl:text>": {
  "styleproperties": {
    "StyleProperty": [
</xsl:text>
    <xsl:apply-templates select="//wdgst:StyleProperties/wdgst:StyleProperty"/>
    <xsl:text>
    ]
  }
}</xsl:text>
    <xsl:if test="contains($last,'false')">
      <xsl:text>,
</xsl:text>
    </xsl:if>
    <xsl:if test="contains($last,'true')">
      <xsl:text>
}</xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="wdgst:StyleProperty">
    <xsl:text>      { "$": { </xsl:text>
    <xsl:apply-templates select="@*[name()!='category']"/>
    <xsl:text>}, "StyleElement": [</xsl:text>
    <xsl:apply-templates select="wdgst:StyleElement"/>
    <xsl:text>] }</xsl:text>
    <xsl:if test="not(position()=last())">
      <xsl:text>,
</xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="@*">
    <xsl:text>"</xsl:text><xsl:value-of select="name()"/><xsl:text>":"</xsl:text><xsl:value-of select="."/><xsl:text>"</xsl:text>
    <xsl:if test="not(position()=last())">
      <xsl:text>,</xsl:text>
    </xsl:if>
	</xsl:template>
  
  <xsl:template match="wdgst:StyleElement">
    <xsl:text>{ "$": { </xsl:text>
    <xsl:if test="@attribute">
      <xsl:text>"attribute": "</xsl:text><xsl:value-of select="@attribute"/><xsl:text>"</xsl:text>
    </xsl:if>
    <xsl:if test="@selector">
      <xsl:text>, "selector": "</xsl:text><xsl:value-of select="@selector"/><xsl:text>"</xsl:text>
    </xsl:if>
    <xsl:text>}}</xsl:text>
    <xsl:if test="not(position()=last())">
      <xsl:text>,</xsl:text>
    </xsl:if>
	</xsl:template>

</xsl:stylesheet>